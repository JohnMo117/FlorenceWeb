/**
 * Administration API routes
 * Mounted at /api/admin
 *
 * Uses parameterized MySQL queries via server/db.js.
 */

import { Router } from 'express';
import { query, execute } from '../db.js';

const router = Router();

// ─── Input validation helpers ───────────────────────────────────────────────
const VALID_ROLES = ['Student', 'Teacher'];
const VALID_REG_STATUSES = ['Pending documents', 'Profile review', 'Payment check', 'Contract draft', 'Approved', 'Rejected'];
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const MAX_STRING_LENGTH = 200;
const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];

function isValidString(value, maxLen = MAX_STRING_LENGTH) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/registrations
 * List all registrations from MySQL.
 */
router.get('/registrations', async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT id, name, role, status, curp, address, english_level AS englishLevel, created_at AS createdAt 
       FROM registrations 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/registrations
 * Create a new student or teacher registration record in MySQL.
 */
router.post('/registrations', async (req, res, next) => {
  try {
    const { name, role, curp, address, englishLevel } = req.body;

    if (!isValidString(name)) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string (max 200 chars).' });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` });
    }
    if (curp !== undefined && typeof curp !== 'string') {
      return res.status(400).json({ error: 'CURP must be a string.' });
    }
    if (curp && curp.length > 18) {
      return res.status(400).json({ error: 'CURP must be at most 18 characters.' });
    }
    if (address !== undefined && typeof address !== 'string') {
      return res.status(400).json({ error: 'Address must be a string.' });
    }
    if (address && address.length > 500) {
      return res.status(400).json({ error: 'Address must be at most 500 characters.' });
    }
    if (englishLevel !== undefined && englishLevel !== '' && !VALID_LEVELS.includes(englishLevel)) {
      return res.status(400).json({ error: `English level must be one of: ${VALID_LEVELS.join(', ')}` });
    }

    const id = generateId('reg-');
    const trimmedName = name.trim();
    const trimmedCurp = (curp || '').trim();
    const trimmedAddress = (address || '').trim();
    const level = englishLevel || '';

    await execute(
      `INSERT INTO registrations (id, name, role, status, curp, address, english_level) 
       VALUES (?, ?, ?, 'Pending documents', ?, ?, ?)`,
      [id, trimmedName, role, trimmedCurp, trimmedAddress, level]
    );

    res.status(201).json({
      id,
      name: trimmedName,
      role,
      status: 'Pending documents',
      curp: trimmedCurp,
      address: trimmedAddress,
      englishLevel: level,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/registrations/:id
 * Update a registration's status (or other fields).
 */
router.put('/registrations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await query('SELECT * FROM registrations WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    const current = existing[0];
    const { name, status, curp, address, englishLevel } = req.body;

    const newName = name !== undefined ? name.trim() : current.name;
    const newStatus = status !== undefined ? status : current.status;
    const newCurp = curp !== undefined ? (curp || '').trim() : current.curp;
    const newAddress = address !== undefined ? (address || '').trim() : current.address;
    const newLevel = englishLevel !== undefined ? englishLevel : current.english_level;

    if (name !== undefined && !isValidString(name)) {
      return res.status(400).json({ error: 'Name must be a non-empty string (max 200 chars).' });
    }
    if (status !== undefined && !VALID_REG_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_REG_STATUSES.join(', ')}` });
    }
    if (englishLevel !== undefined && englishLevel !== '' && !VALID_LEVELS.includes(englishLevel)) {
      return res.status(400).json({ error: `English level must be one of: ${VALID_LEVELS.join(', ')}` });
    }

    await execute(
      `UPDATE registrations SET name = ?, status = ?, curp = ?, address = ?, english_level = ? WHERE id = ?`,
      [newName, newStatus, newCurp, newAddress, newLevel, id]
    );

    res.json({
      id,
      name: newName,
      role: current.role,
      status: newStatus,
      curp: newCurp,
      address: newAddress,
      englishLevel: newLevel,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/registrations/:id
 * Remove a registration.
 */
router.delete('/registrations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await execute('DELETE FROM registrations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    res.json({ message: 'Registration removed.' });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/timetables
 * Return per-group timetables with group metadata from MySQL.
 */
router.get('/timetables', async (_req, res, next) => {
  try {
    const [groupRows] = await query(
      `SELECT g.id AS groupId, g.level, g.title, g.room, COALESCE(t.name, 'Unassigned') AS teacherName
       FROM \`groups\` g
       LEFT JOIN teachers t ON g.teacher_id = t.id
       ORDER BY g.id`
    );

    const [slotRows] = await query(`SELECT id, group_id AS groupId, day, time_slot AS timeSlot, room, activity FROM timetable_slots`);

    const groupTimetables = groupRows.map((group) => {
      const grid = VALID_DAYS.map((day) => {
        const daySlots = slotRows
          .filter((s) => s.groupId === group.groupId && s.day === day)
          .sort((a, b) => VALID_TIME_SLOTS.indexOf(a.timeSlot) - VALID_TIME_SLOTS.indexOf(b.timeSlot));
        return {
          day,
          slots: daySlots.map((slot) => ({
            id: slot.id,
            timeSlot: slot.timeSlot,
            activity: slot.activity,
            room: slot.room,
          })),
        };
      });

      return {
        groupId: group.groupId,
        level: group.level,
        title: group.title,
        room: group.room,
        teacherName: group.teacherName,
        timetable: grid,
      };
    });

    res.json({ times: VALID_TIME_SLOTS, groups: groupTimetables });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/timetables/:id
 * Update a single timetable slot.
 */
router.put('/timetables/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await query('SELECT * FROM timetable_slots WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Timetable slot not found.' });
    }

    const current = existing[0];
    const { activity, room, groupId } = req.body;

    const newActivity = activity !== undefined ? activity.trim() : current.activity;
    const newRoom = room !== undefined ? (room ? room.trim() : null) : current.room;
    const newGroupId = groupId !== undefined ? groupId : current.group_id;

    if (activity !== undefined && (typeof activity !== 'string' || activity.length > MAX_STRING_LENGTH)) {
      return res.status(400).json({ error: 'Activity must be a string (max 200 chars).' });
    }
    if (groupId !== undefined && groupId !== null) {
      const [grp] = await query('SELECT id FROM `groups` WHERE id = ?', [groupId]);
      if (grp.length === 0) {
        return res.status(400).json({ error: 'Group not found.' });
      }
    }

    await execute(
      'UPDATE timetable_slots SET activity = ?, room = ?, group_id = ? WHERE id = ?',
      [newActivity, newRoom, newGroupId, id]
    );

    res.json({
      id,
      groupId: newGroupId,
      day: current.day,
      timeSlot: current.time_slot,
      room: newRoom,
      activity: newActivity,
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// CLASSES (English-level groups)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/classes
 * List all English-level groups with teacher name resolved from MySQL.
 */
router.get('/classes', async (_req, res, next) => {
  try {
    const [rows] = await query(
      `SELECT g.id, g.level, g.title, g.room, g.teacher_id AS teacherId, 
              g.student_count AS studentCount, g.period, g.focus, 
              COALESCE(t.name, 'Unassigned') AS teacher
       FROM \`groups\` g
       LEFT JOIN teachers t ON g.teacher_id = t.id
       ORDER BY g.level`
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/classes
 * Create a new English-level class/group in MySQL.
 */
router.post('/classes', async (req, res, next) => {
  try {
    const { level, title, room, teacherId, studentCount, period, focus } = req.body;

    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ error: `Level must be one of: ${VALID_LEVELS.join(', ')}` });
    }
    if (!isValidString(title)) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!isValidString(room)) {
      return res.status(400).json({ error: 'Room is required.' });
    }
    if (teacherId) {
      const [t] = await query('SELECT id FROM teachers WHERE id = ?', [teacherId]);
      if (t.length === 0) {
        return res.status(400).json({ error: 'Teacher not found.' });
      }
    }

    const id = generateId('grp-');
    const count = typeof studentCount === 'number' && studentCount >= 0 ? studentCount : 0;
    const trimmedTitle = title.trim();
    const trimmedRoom = room.trim();
    const tid = teacherId || null;
    const trimmedPeriod = (period || '').trim();
    const trimmedFocus = (focus || '').trim();

    await execute(
      `INSERT INTO \`groups\` (id, level, title, room, teacher_id, student_count, period, focus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, level, trimmedTitle, trimmedRoom, tid, count, trimmedPeriod, trimmedFocus]
    );

    res.status(201).json({
      id,
      level,
      title: trimmedTitle,
      room: trimmedRoom,
      teacherId: tid,
      studentCount: count,
      period: trimmedPeriod,
      focus: trimmedFocus,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/admin/classes/:id
 * Update an English-level class/group.
 */
router.put('/classes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await query('SELECT * FROM `groups` WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    const current = existing[0];
    const { level, title, room, teacherId, studentCount, period, focus } = req.body;

    const newLevel = level !== undefined ? level : current.level;
    const newTitle = title !== undefined ? title.trim() : current.title;
    const newRoom = room !== undefined ? room.trim() : current.room;
    const newTeacherId = teacherId !== undefined ? teacherId : current.teacher_id;
    const newStudentCount = studentCount !== undefined ? studentCount : current.student_count;
    const newPeriod = period !== undefined ? (period || '').trim() : current.period;
    const newFocus = focus !== undefined ? (focus || '').trim() : current.focus;

    if (level !== undefined && !VALID_LEVELS.includes(level)) {
      return res.status(400).json({ error: `Level must be one of: ${VALID_LEVELS.join(', ')}` });
    }
    if (title !== undefined && !isValidString(title)) {
      return res.status(400).json({ error: 'Title must be a non-empty string.' });
    }
    if (room !== undefined && !isValidString(room)) {
      return res.status(400).json({ error: 'Room must be a non-empty string.' });
    }
    if (teacherId !== undefined && teacherId !== null) {
      const [t] = await query('SELECT id FROM teachers WHERE id = ?', [teacherId]);
      if (t.length === 0) {
        return res.status(400).json({ error: 'Teacher not found.' });
      }
    }

    await execute(
      `UPDATE \`groups\` SET level = ?, title = ?, room = ?, teacher_id = ?, student_count = ?, period = ?, focus = ? WHERE id = ?`,
      [newLevel, newTitle, newRoom, newTeacherId, newStudentCount, newPeriod, newFocus, id]
    );

    res.json({
      id,
      level: newLevel,
      title: newTitle,
      room: newRoom,
      teacherId: newTeacherId,
      studentCount: newStudentCount,
      period: newPeriod,
      focus: newFocus,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/admin/classes/:id
 * Remove an English-level class/group.
 */
router.delete('/classes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await execute('DELETE FROM `groups` WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Class not found.' });
    }
    res.json({ message: 'Class removed.' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/teachers
 * List all available teachers for class assignment dropdowns.
 */
router.get('/teachers', async (_req, res, next) => {
  try {
    const [teachers] = await query('SELECT id, name, email, subject FROM teachers ORDER BY name');
    res.json(teachers);
  } catch (error) {
    next(error);
  }
});

export default router;
