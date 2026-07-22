/**
 * Student API routes
 * Mounted at /api/students
 *
 * Uses parameterized MySQL queries via server/db.js.
 */

import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];
const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/**
 * Validate that studentId exists in database.
 */
async function resolveStudent(req, res) {
  const studentId = req.query.studentId;
  if (!studentId || typeof studentId !== 'string') {
    res.status(400).json({ error: 'studentId query parameter is required.' });
    return null;
  }
  const [rows] = await query('SELECT id, name, email FROM students WHERE id = ?', [studentId]);
  if (rows.length === 0) {
    res.status(404).json({ error: 'Student not found.' });
    return null;
  }
  return rows[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/grades?studentId=S1
 * Get all published grades for this student from MySQL.
 */
router.get('/grades', async (req, res, next) => {
  try {
    const student = await resolveStudent(req, res);
    if (!student) return;

    const [rows] = await query(
      `SELECT g.assessment AS subject, g.score, COALESCE(g.note, '') AS note
       FROM grades g
       WHERE g.student_id = ? AND g.status = 'Published'`,
      [student.id]
    );

    const studentGrades = rows.map((g) => ({
      subject: g.subject,
      score: Number(g.score).toFixed(1),
      note: g.note,
    }));

    res.json(studentGrades);
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/timetable?studentId=S1
 * Get the student's timetable based on their enrolled groups from MySQL.
 */
router.get('/timetable', async (req, res, next) => {
  try {
    const student = await resolveStudent(req, res);
    if (!student) return;

    const [enrolled] = await query('SELECT group_id FROM student_groups WHERE student_id = ?', [student.id]);
    const enrolledGroupIds = enrolled.map((sg) => sg.group_id);

    if (enrolledGroupIds.length === 0) {
      const emptyGrid = VALID_DAYS.map((day) => ({
        day,
        slots: VALID_TIME_SLOTS.map(() => '-'),
      }));
      return res.json({ times: VALID_TIME_SLOTS, timetable: emptyGrid });
    }

    const [slots] = await query(
      `SELECT ts.day, ts.time_slot AS timeSlot, ts.activity
       FROM timetable_slots ts
       WHERE ts.group_id IN (?) AND ts.activity IS NOT NULL AND ts.activity != ''`,
      [enrolledGroupIds]
    );

    const grid = VALID_DAYS.map((day) => {
      const daySlots = VALID_TIME_SLOTS.map((timeSlot) => {
        const matches = slots.filter((s) => s.day === day && s.timeSlot === timeSlot);
        if (matches.length === 0) return '-';
        return matches.map((m) => m.activity).join(' / ');
      });
      return { day, slots: daySlots };
    });

    res.json({ times: VALID_TIME_SLOTS, timetable: grid });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// CLASSES (student's enrolled groups)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/classes?studentId=S1
 * List the English-level groups the student is enrolled in from MySQL.
 */
router.get('/classes', async (req, res, next) => {
  try {
    const student = await resolveStudent(req, res);
    if (!student) return;

    const [studentClasses] = await query(
      `SELECT g.level, g.title AS name, g.room, COALESCE(t.name, 'Unassigned') AS teacher
       FROM \`groups\` g
       JOIN student_groups sg ON g.id = sg.group_id
       LEFT JOIN teachers t ON g.teacher_id = t.id
       WHERE sg.student_id = ?`,
      [student.id]
    );

    res.json(studentClasses);
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/students/announcements?studentId=S1
 * Get announcements relevant to this student from MySQL.
 */
router.get('/announcements', async (req, res, next) => {
  try {
    const student = await resolveStudent(req, res);
    if (!student) return;

    const [groupRows] = await query(
      `SELECT g.level, g.title
       FROM \`groups\` g
       JOIN student_groups sg ON g.id = sg.group_id
       WHERE sg.student_id = ?`,
      [student.id]
    );

    const enrolledTitles = groupRows
      .map((g) => [g.title, `${g.level} ${g.title}`, `${g.level} - ${g.title}`])
      .flat();

    const [allAnnouncements] = await query(
      `SELECT id, title, audience, message, created_at AS createdAt
       FROM announcements
       ORDER BY id DESC`
    );

    const relevant = allAnnouncements.filter((a) => {
      if (a.audience === 'All students') return true;
      return enrolledTitles.some(
        (title) =>
          a.audience.toLowerCase().includes(title.toLowerCase()) ||
          title.toLowerCase().includes(a.audience.toLowerCase())
      );
    });

    res.json(
      relevant.map((a) => ({
        title: a.title,
        audience: a.audience,
        message: a.message,
        createdAt: a.createdAt,
      }))
    );
  } catch (error) {
    next(error);
  }
});

export default router;
