/**
 * Teacher API routes
 * Mounted at /api/teachers
 *
 * TODO(security): Add JWT authentication middleware — only teacher-role tokens should access these routes.
 * TODO(security): Derive teacherId from the verified JWT token, not from query params.
 * TODO(security): Add rate limiting to prevent abuse.
 */

import { Router } from 'express';
import {
  groups,
  grades,
  timetableSlots,
  announcements,
  teachers,
  studentGroups,
  generateId,
  findById,
  addItem,
  updateItem,
} from '../data/mockData.js';

const router = Router();

// ─── Input validation helpers ───────────────────────────────────────────────
const VALID_GRADE_STATUSES = ['Published', 'Pending', 'Needs review'];
const MAX_STRING_LENGTH = 200;
const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];
const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function isValidString(value, maxLen = MAX_STRING_LENGTH) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

/**
 * Validate that teacherId exists. Returns the teacher or sends a 400 response.
 * TODO(security): Replace with JWT-derived identity.
 */
function resolveTeacher(req, res) {
  const teacherId = req.query.teacherId;
  if (!teacherId || typeof teacherId !== 'string') {
    res.status(400).json({ error: 'teacherId query parameter is required.' });
    return null;
  }
  const teacher = findById(teachers, teacherId);
  if (!teacher) {
    res.status(404).json({ error: 'Teacher not found.' });
    return null;
  }
  return teacher;
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/groups?teacherId=T1
 * List groups assigned to the given teacher.
 * TODO(db): SELECT * FROM groups WHERE teacher_id = ?
 */
router.get('/groups', (req, res) => {
  const teacher = resolveTeacher(req, res);
  if (!teacher) return; // response already sent

  const teacherGroups = groups.filter((g) => g.teacherId === teacher.id);
  res.json(teacherGroups);
});

// ═══════════════════════════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/grades/:groupId?teacherId=T1
 * Get all grades for a specific group (only if teacher owns the group).
 * TODO(db): SELECT g.* FROM grades g JOIN groups gr ON g.group_id = gr.id WHERE gr.teacher_id = ? AND g.group_id = ?
 */
router.get('/grades/:groupId', (req, res) => {
  const teacher = resolveTeacher(req, res);
  if (!teacher) return;

  const { groupId } = req.params;
  const group = findById(groups, groupId);

  if (!group) {
    return res.status(404).json({ error: 'Group not found.' });
  }
  // Only allow teacher to see their own groups
  if (group.teacherId !== teacher.id) {
    return res.status(403).json({ error: 'You are not assigned to this group.' });
  }

  const groupGrades = grades.filter((g) => g.groupId === groupId);
  res.json(groupGrades);
});

/**
 * POST /api/teachers/grades
 * Submit a new grade record.
 * Body: { teacherId, groupId, studentName, assessment, score, status }
 * TODO(db): INSERT INTO grades (student_id, student_name, group_id, assessment, score, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW())
 */
router.post('/grades', (req, res) => {
  const { teacherId, groupId, studentName, assessment, score, status } = req.body;

  // Validate teacherId
  if (!teacherId || !findById(teachers, teacherId)) {
    return res.status(400).json({ error: 'Valid teacherId is required.' });
  }

  // Validate groupId and teacher ownership
  const group = findById(groups, groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found.' });
  }
  if (group.teacherId !== teacherId) {
    return res.status(403).json({ error: 'You are not assigned to this group.' });
  }

  // Validate fields
  if (!isValidString(studentName)) {
    return res.status(400).json({ error: 'Student name is required (max 200 chars).' });
  }
  if (!isValidString(assessment)) {
    return res.status(400).json({ error: 'Assessment name is required (max 200 chars).' });
  }

  const numericScore = Number(score);
  if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
    return res.status(400).json({ error: 'Score must be a number between 0 and 10.' });
  }

  if (!VALID_GRADE_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_GRADE_STATUSES.join(', ')}` });
  }

  // Try to resolve studentId from studentName (best effort for mock)
  // TODO(db): Use a proper student ID from the frontend select, not a name lookup
  const newGrade = {
    id: generateId('g-'),
    studentId: null, // TODO(db): resolve from student table
    studentName: studentName.trim(),
    groupId,
    assessment: assessment.trim(),
    score: numericScore,
    status,
    updatedAt: 'Just now',
  };

  addItem(grades, newGrade);
  res.status(201).json(newGrade);
});

/**
 * PUT /api/teachers/grades/:id
 * Edit an existing grade record.
 * TODO(db): UPDATE grades SET student_name = ?, assessment = ?, score = ?, status = ?, updated_at = NOW() WHERE id = ? AND group_id IN (SELECT id FROM groups WHERE teacher_id = ?)
 */
router.put('/grades/:id', (req, res) => {
  const { id } = req.params;
  const existing = findById(grades, id);
  if (!existing) {
    return res.status(404).json({ error: 'Grade not found.' });
  }

  // Verify teacher ownership
  const { teacherId } = req.body;
  if (!teacherId) {
    return res.status(400).json({ error: 'teacherId is required.' });
  }
  const group = findById(groups, existing.groupId);
  if (!group || group.teacherId !== teacherId) {
    return res.status(403).json({ error: 'You are not assigned to this group.' });
  }

  const updates = {};
  const { studentName, assessment, score, status } = req.body;

  if (studentName !== undefined) {
    if (!isValidString(studentName)) return res.status(400).json({ error: 'Student name must be a non-empty string.' });
    updates.studentName = studentName.trim();
  }
  if (assessment !== undefined) {
    if (!isValidString(assessment)) return res.status(400).json({ error: 'Assessment must be a non-empty string.' });
    updates.assessment = assessment.trim();
  }
  if (score !== undefined) {
    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      return res.status(400).json({ error: 'Score must be between 0 and 10.' });
    }
    updates.score = numericScore;
  }
  if (status !== undefined) {
    if (!VALID_GRADE_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_GRADE_STATUSES.join(', ')}` });
    }
    updates.status = status;
  }

  updates.updatedAt = 'Just now';
  const updated = updateItem(grades, id, updates);
  res.json(updated);
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/timetable?teacherId=T1
 * Get the teacher's own timetable (slots for their groups).
 * TODO(db): SELECT ts.* FROM timetable_slots ts JOIN groups g ON ts.group_id = g.id WHERE g.teacher_id = ?
 *           UNION SELECT ts.* FROM timetable_slots ts WHERE ts.group_id IS NULL
 */
router.get('/timetable', (req, res) => {
  const teacher = resolveTeacher(req, res);
  if (!teacher) return;

  // Get groups this teacher owns
  const teacherGroupIds = groups
    .filter((g) => g.teacherId === teacher.id)
    .map((g) => g.id);

  // Build timetable: include slots for teacher's groups + non-group slots (planning, office hour, etc.)
  const grid = VALID_DAYS.map((day) => {
    const daySlots = VALID_TIME_SLOTS.map((timeSlot) => {
      const slot = timetableSlots.find(
        (s) => s.day === day && s.timeSlot === timeSlot
      );
      if (!slot) {
        return { timeSlot, activity: '-', room: null };
      }
      // Show the slot if it belongs to teacher's group or is a general activity
      if (slot.groupId === null || teacherGroupIds.includes(slot.groupId)) {
        return { timeSlot, activity: slot.activity, room: slot.room };
      }
      // Slot belongs to another teacher's group — show as free
      return { timeSlot, activity: '-', room: null };
    });
    return { day, slots: daySlots };
  });

  res.json({ times: VALID_TIME_SLOTS, timetable: grid });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS (Broadcasts)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/announcements?teacherId=T1
 * List announcements posted by this teacher.
 * TODO(db): SELECT * FROM announcements WHERE teacher_id = ? ORDER BY created_at DESC
 */
router.get('/announcements', (req, res) => {
  const teacher = resolveTeacher(req, res);
  if (!teacher) return;

  const teacherAnnouncements = announcements.filter((a) => a.teacherId === teacher.id);
  res.json(teacherAnnouncements);
});

/**
 * POST /api/teachers/announcements
 * Create a new broadcast announcement.
 * Body: { teacherId, title, audience, message }
 * TODO(db): INSERT INTO announcements (teacher_id, title, audience, message, created_at) VALUES (?, ?, ?, ?, NOW())
 */
router.post('/announcements', (req, res) => {
  const { teacherId, title, audience, message } = req.body;

  // Validate teacher
  if (!teacherId || !findById(teachers, teacherId)) {
    return res.status(400).json({ error: 'Valid teacherId is required.' });
  }

  // Validate fields
  if (!isValidString(title)) {
    return res.status(400).json({ error: 'Title is required (max 200 chars).' });
  }
  if (!isValidString(audience)) {
    return res.status(400).json({ error: 'Audience is required (max 200 chars).' });
  }
  if (!isValidString(message, 2000)) {
    return res.status(400).json({ error: 'Message is required (max 2000 chars).' });
  }

  const now = new Date();
  const createdAt = now.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  });

  const newAnnouncement = {
    id: generateId('ann-'),
    teacherId,
    title: title.trim(),
    audience: audience.trim(),
    message: message.trim(),
    createdAt,
  };

  // Add to beginning of array (newest first)
  announcements.unshift(newAnnouncement);
  res.status(201).json(newAnnouncement);
});

export default router;
