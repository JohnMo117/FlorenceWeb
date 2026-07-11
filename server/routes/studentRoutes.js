/**
 * Student API routes
 * Mounted at /api/students
 *
 * All endpoints are read-only (GET).
 *
 * TODO(security): Add JWT authentication middleware — only student-role tokens should access these routes.
 * TODO(security): Derive studentId from the verified JWT token, not from query params.
 * TODO(security): Add rate limiting to prevent abuse.
 */

import { Router } from 'express';
import {
  students,
  grades,
  groups,
  timetableSlots,
  announcements,
  studentGroups,
  teachers,
  findById,
} from '../data/mockData.js';

const router = Router();

const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];
const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * Validate that studentId exists. Returns the student or sends a 400 response.
 * TODO(security): Replace with JWT-derived identity.
 */
function resolveStudent(req, res) {
  const studentId = req.query.studentId;
  if (!studentId || typeof studentId !== 'string') {
    res.status(400).json({ error: 'studentId query parameter is required.' });
    return null;
  }
  const student = findById(students, studentId);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return null;
  }
  return student;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/grades?studentId=S1
 * Get all grades for this student.
 * TODO(db): SELECT g.assessment AS subject, g.score, g.note FROM grades g WHERE g.student_id = ? AND g.status = 'Published'
 */
router.get('/grades', (req, res) => {
  const student = resolveStudent(req, res);
  if (!student) return;

  const studentGrades = grades
    .filter((g) => g.studentId === student.id && g.status === 'Published')
    .map((g) => ({
      subject: g.assessment,
      score: g.score.toFixed(1),
      note: g.note || '',
    }));

  res.json(studentGrades);
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/timetable?studentId=S1
 * Get the student's timetable based on their enrolled groups.
 * TODO(db): SELECT ts.day, ts.time_slot, ts.activity FROM timetable_slots ts
 *           JOIN student_groups sg ON ts.group_id = sg.group_id
 *           WHERE sg.student_id = ?
 *           ORDER BY ts.day, ts.time_slot
 */
router.get('/timetable', (req, res) => {
  const student = resolveStudent(req, res);
  if (!student) return;

  // Get group IDs this student is enrolled in
  const enrolledGroupIds = studentGroups
    .filter((sg) => sg.studentId === student.id)
    .map((sg) => sg.groupId);

  // Build the timetable grid
  const grid = VALID_DAYS.map((day) => {
    const slots = VALID_TIME_SLOTS.map((timeSlot) => {
      const slot = timetableSlots.find(
        (s) => s.day === day && s.timeSlot === timeSlot
      );
      if (!slot) return '-';
      // Show the activity if it belongs to one of the student's groups or is a general slot
      if (slot.groupId === null || enrolledGroupIds.includes(slot.groupId)) {
        return slot.activity;
      }
      return '-';
    });
    return { day, slots };
  });

  res.json({ times: VALID_TIME_SLOTS, timetable: grid });
});

// ═══════════════════════════════════════════════════════════════════════════
// CLASSES (student's enrolled groups)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/classes?studentId=S1
 * List the English-level groups the student is enrolled in.
 * TODO(db): SELECT g.level, g.title AS name, g.room, t.name AS teacher
 *           FROM groups g
 *           JOIN student_groups sg ON g.id = sg.group_id
 *           JOIN teachers t ON g.teacher_id = t.id
 *           WHERE sg.student_id = ?
 */
router.get('/classes', (req, res) => {
  const student = resolveStudent(req, res);
  if (!student) return;

  const enrolledGroupIds = studentGroups
    .filter((sg) => sg.studentId === student.id)
    .map((sg) => sg.groupId);

  const studentClasses = groups
    .filter((g) => enrolledGroupIds.includes(g.id))
    .map((g) => {
      const teacher = findById(teachers, g.teacherId);
      return {
        level: g.level,
        name: g.title,
        room: g.room,
        teacher: teacher ? teacher.name : 'Unassigned',
      };
    });

  res.json(studentClasses);
});

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/announcements?studentId=S1
 * Get announcements relevant to this student (for their groups or "All students").
 * TODO(db): SELECT a.title, a.audience, a.message, a.created_at
 *           FROM announcements a
 *           WHERE a.audience = 'All students'
 *              OR a.audience IN (SELECT g.title FROM groups g JOIN student_groups sg ON g.id = sg.group_id WHERE sg.student_id = ?)
 *           ORDER BY a.created_at DESC
 */
router.get('/announcements', (req, res) => {
  const student = resolveStudent(req, res);
  if (!student) return;

  // Get group titles for matching audience
  const enrolledGroupIds = studentGroups
    .filter((sg) => sg.studentId === student.id)
    .map((sg) => sg.groupId);

  const enrolledGroupTitles = groups
    .filter((g) => enrolledGroupIds.includes(g.id))
    .map((g) => {
      // Match against various audience formats the teacher might use
      return [
        g.title,
        `${g.level} ${g.title}`,
        `${g.level} - ${g.title}`,
      ];
    })
    .flat();

  const relevantAnnouncements = announcements.filter((a) => {
    if (a.audience === 'All students') return true;
    // Check if the announcement audience matches any of the student's group titles
    return enrolledGroupTitles.some((title) =>
      a.audience.toLowerCase().includes(title.toLowerCase()) ||
      title.toLowerCase().includes(a.audience.toLowerCase())
    );
  });

  res.json(
    relevantAnnouncements.map((a) => ({
      title: a.title,
      audience: a.audience,
      message: a.message,
      createdAt: a.createdAt,
    }))
  );
});

export default router;
