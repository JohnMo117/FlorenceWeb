/**
 * Teacher API routes
 * Mounted at /api/teachers
 *
 * Uses parameterized MySQL queries via server/db.js.
 */

import { Router } from 'express';
import { query, execute } from '../db.js';

const router = Router();

// ─── Input validation helpers ───────────────────────────────────────────────
const VALID_GRADE_STATUSES = ['Published', 'Pending', 'Needs review'];
const MAX_STRING_LENGTH = 200;
const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];
const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function isValidString(value, maxLen = MAX_STRING_LENGTH) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Validate that teacherId exists in database.
 */
async function resolveTeacher(req, res) {
  const teacherId = req.query.teacherId;
  if (!teacherId || typeof teacherId !== 'string') {
    res.status(400).json({ error: 'teacherId query parameter is required.' });
    return null;
  }

  const [rows] = await query('SELECT id, name, email FROM teachers WHERE id = ?', [teacherId]);
  if (rows.length === 0) {
    res.status(404).json({ error: 'Teacher not found.' });
    return null;
  }
  return rows[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// GROUPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/groups?teacherId=T1
 * List groups assigned to the given teacher from MySQL.
 */
router.get('/groups', async (req, res, next) => {
  try {
    const teacher = await resolveTeacher(req, res);
    if (!teacher) return;

    const [groups] = await query(
      `SELECT id, level, title, room, teacher_id AS teacherId, student_count AS studentCount, period, focus
       FROM \`groups\`
       WHERE teacher_id = ?`,
      [teacher.id]
    );

    res.json(groups);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teachers/groups/:groupId/students?teacherId=T1
 * Get all students enrolled in a specific group.
 */
router.get('/groups/:groupId/students', async (req, res, next) => {
  try {
    const teacher = await resolveTeacher(req, res);
    if (!teacher) return;

    const { groupId } = req.params;
    const [grp] = await query('SELECT teacher_id FROM `groups` WHERE id = ?', [groupId]);
    
    if (grp.length === 0) {
      return res.status(404).json({ error: 'Group not found.' });
    }
    if (grp[0].teacher_id !== teacher.id) {
      return res.status(403).json({ error: 'You are not assigned to this group.' });
    }

    const [students] = await query(
      `SELECT s.id, s.name, s.email, s.english_level AS englishLevel
       FROM students s
       JOIN student_groups sg ON s.id = sg.student_id
       WHERE sg.group_id = ?
       ORDER BY s.name ASC`,
      [groupId]
    );

    res.json(students);
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// GRADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/grades/:groupId?teacherId=T1
 * Get all grades for a specific group from MySQL.
 */
router.get('/grades/:groupId', async (req, res, next) => {
  try {
    const teacher = await resolveTeacher(req, res);
    if (!teacher) return;

    const { groupId } = req.params;
    const [grp] = await query('SELECT teacher_id FROM `groups` WHERE id = ?', [groupId]);

    if (grp.length === 0) {
      return res.status(404).json({ error: 'Group not found.' });
    }
    if (grp[0].teacher_id !== teacher.id) {
      return res.status(403).json({ error: 'You are not assigned to this group.' });
    }

    const [groupGrades] = await query(
      `SELECT id, student_id AS studentId, student_name AS studentName, group_id AS groupId, 
              assessment, score, status, updated_at AS updatedAt, note
       FROM grades
       WHERE group_id = ?`,
      [groupId]
    );

    res.json(groupGrades);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/teachers/grades
 * Submit a new grade record to MySQL.
 */
router.post('/grades', async (req, res, next) => {
  try {
    const { teacherId, groupId, studentName, assessment, score, status } = req.body;

    if (!teacherId || typeof teacherId !== 'string') {
      return res.status(400).json({ error: 'Valid teacherId is required.' });
    }

    const [t] = await query('SELECT id FROM teachers WHERE id = ?', [teacherId]);
    if (t.length === 0) {
      return res.status(400).json({ error: 'Valid teacherId is required.' });
    }

    const [grp] = await query('SELECT teacher_id FROM `groups` WHERE id = ?', [groupId]);
    if (grp.length === 0) {
      return res.status(404).json({ error: 'Group not found.' });
    }
    if (grp[0].teacher_id !== teacherId) {
      return res.status(403).json({ error: 'You are not assigned to this group.' });
    }

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

    // Try resolving student_id by matching name
    const [st] = await query('SELECT id FROM students WHERE name = ? LIMIT 1', [studentName.trim()]);
    const studentId = st.length > 0 ? st[0].id : null;

    const id = generateId('g-');
    const trimmedName = studentName.trim();
    const trimmedAssessment = assessment.trim();

    await execute(
      `INSERT INTO grades (id, student_id, student_name, group_id, assessment, score, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, studentId, trimmedName, groupId, trimmedAssessment, numericScore, status]
    );

    res.status(201).json({
      id,
      studentId,
      studentName: trimmedName,
      groupId,
      assessment: trimmedAssessment,
      score: numericScore,
      status,
      updatedAt: 'Just now',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/teachers/grades/:id
 * Edit an existing grade record in MySQL.
 */
router.put('/grades/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await query('SELECT * FROM grades WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Grade not found.' });
    }

    const current = existing[0];
    const { teacherId, studentName, assessment, score, status } = req.body;

    if (!teacherId) {
      return res.status(400).json({ error: 'teacherId is required.' });
    }

    const [grp] = await query('SELECT teacher_id FROM `groups` WHERE id = ?', [current.group_id]);
    if (grp.length === 0 || grp[0].teacher_id !== teacherId) {
      return res.status(403).json({ error: 'You are not assigned to this group.' });
    }

    const newName = studentName !== undefined ? studentName.trim() : current.student_name;
    const newAssessment = assessment !== undefined ? assessment.trim() : current.assessment;
    const newScore = score !== undefined ? Number(score) : current.score;
    const newStatus = status !== undefined ? status : current.status;

    if (studentName !== undefined && !isValidString(studentName)) {
      return res.status(400).json({ error: 'Student name must be a non-empty string.' });
    }
    if (assessment !== undefined && !isValidString(assessment)) {
      return res.status(400).json({ error: 'Assessment must be a non-empty string.' });
    }
    if (score !== undefined && (isNaN(newScore) || newScore < 0 || newScore > 10)) {
      return res.status(400).json({ error: 'Score must be between 0 and 10.' });
    }
    if (status !== undefined && !VALID_GRADE_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_GRADE_STATUSES.join(', ')}` });
    }

    await execute(
      `UPDATE grades SET student_name = ?, assessment = ?, score = ?, status = ?, updated_at = NOW() WHERE id = ?`,
      [newName, newAssessment, newScore, newStatus, id]
    );

    res.json({
      id,
      studentId: current.student_id,
      studentName: newName,
      groupId: current.group_id,
      assessment: newAssessment,
      score: newScore,
      status: newStatus,
      updatedAt: 'Just now',
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/timetable?teacherId=T1
 * Get the teacher's own aggregated timetable from MySQL.
 */
router.get('/timetable', async (req, res, next) => {
  try {
    const teacher = await resolveTeacher(req, res);
    if (!teacher) return;

    const [teacherGroups] = await query('SELECT id FROM `groups` WHERE teacher_id = ?', [teacher.id]);
    const groupIds = teacherGroups.map((g) => g.id);

    if (groupIds.length === 0) {
      const emptyGrid = VALID_DAYS.map((day) => ({
        day,
        slots: VALID_TIME_SLOTS.map((timeSlot) => ({ timeSlot, activity: '-', room: null })),
      }));
      return res.json({ times: VALID_TIME_SLOTS, timetable: emptyGrid });
    }

    const [slots] = await query(
      `SELECT ts.day, ts.time_slot AS timeSlot, ts.room, ts.activity 
       FROM timetable_slots ts
       WHERE ts.group_id IN (?) AND ts.activity IS NOT NULL AND ts.activity != ''`,
      [groupIds]
    );

    const grid = VALID_DAYS.map((day) => {
      const daySlots = VALID_TIME_SLOTS.map((timeSlot) => {
        const matches = slots.filter((s) => s.day === day && s.timeSlot === timeSlot);
        if (matches.length === 0) {
          return { timeSlot, activity: '-', room: null };
        }
        const activity = matches.map((m) => m.activity).join(' / ');
        const room = matches.map((m) => m.room).filter(Boolean).join(', ') || null;
        return { timeSlot, activity, room };
      });
      return { day, slots: daySlots };
    });

    res.json({ times: VALID_TIME_SLOTS, timetable: grid });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS (Broadcasts)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/teachers/announcements?teacherId=T1
 * List announcements posted by this teacher from MySQL.
 */
router.get('/announcements', async (req, res, next) => {
  try {
    const teacher = await resolveTeacher(req, res);
    if (!teacher) return;

    const [announcements] = await query(
      `SELECT id, teacher_id AS teacherId, title, audience, message, created_at AS createdAt
       FROM announcements
       WHERE teacher_id = ?
       ORDER BY created_at DESC`,
      [teacher.id]
    );

    res.json(announcements);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/teachers/announcements
 * Create a new broadcast announcement in MySQL.
 */
router.post('/announcements', async (req, res, next) => {
  try {
    const { teacherId, title, audience, message } = req.body;

    if (!teacherId || typeof teacherId !== 'string') {
      return res.status(400).json({ error: 'Valid teacherId is required.' });
    }

    const [t] = await query('SELECT id FROM teachers WHERE id = ?', [teacherId]);
    if (t.length === 0) {
      return res.status(400).json({ error: 'Valid teacherId is required.' });
    }

    if (!isValidString(title)) {
      return res.status(400).json({ error: 'Title is required (max 200 chars).' });
    }
    if (!isValidString(audience)) {
      return res.status(400).json({ error: 'Audience is required (max 200 chars).' });
    }
    if (!isValidString(message, 2000)) {
      return res.status(400).json({ error: 'Message is required (max 200 chars).' });
    }

    const now = new Date();
    const createdAt = now.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });

    const id = generateId('ann-');
    const trimmedTitle = title.trim();
    const trimmedAudience = audience.trim();
    const trimmedMessage = message.trim();

    await execute(
      `INSERT INTO announcements (id, teacher_id, title, audience, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, teacherId, trimmedTitle, trimmedAudience, trimmedMessage, createdAt]
    );

    res.status(201).json({
      id,
      teacherId,
      title: trimmedTitle,
      audience: trimmedAudience,
      message: trimmedMessage,
      createdAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
