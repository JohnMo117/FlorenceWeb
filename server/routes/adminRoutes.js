/**
 * Administration API routes
 * Mounted at /api/admin
 *
 * TODO(security): Add JWT authentication middleware — only admin-role tokens should access these routes.
 * TODO(security): Add rate limiting to prevent abuse.
 */

import { Router } from 'express';
import {
  registrations,
  timetableSlots,
  groups,
  teachers,
  generateId,
  findById,
  addItem,
  updateItem,
  deleteItem,
} from '../data/mockData.js';

const router = Router();

// ─── Input validation helpers ───────────────────────────────────────────────
const VALID_ROLES = ['Student', 'Teacher'];
const VALID_REG_STATUSES = ['Pending documents', 'Profile review', 'Payment check', 'Contract draft', 'Approved', 'Rejected'];
const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const MAX_STRING_LENGTH = 200;

function isValidString(value, maxLen = MAX_STRING_LENGTH) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLen;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/registrations
 * List all registrations.
 * TODO(db): SELECT * FROM registrations ORDER BY id DESC
 */
router.get('/registrations', (_req, res) => {
  res.json(registrations);
});

/**
 * POST /api/admin/registrations
 * Create a new student or teacher registration.
 * TODO(db): INSERT INTO registrations (name, role, status, curp, address, english_level) VALUES (?, ?, ?, ?, ?, ?)
 */
router.post('/registrations', (req, res) => {
  const { name, role, curp, address, englishLevel } = req.body;

  // Validate required fields
  if (!isValidString(name)) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string (max 200 chars).' });
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` });
  }

  // Validate optional fields
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

  const newRegistration = {
    id: generateId('reg-'),
    name: name.trim(),
    role,
    status: 'Pending documents',
    curp: (curp || '').trim(),
    address: (address || '').trim(),
    englishLevel: englishLevel || '',
  };

  addItem(registrations, newRegistration);
  res.status(201).json(newRegistration);
});

/**
 * PUT /api/admin/registrations/:id
 * Update a registration's status (or other fields).
 * TODO(db): UPDATE registrations SET status = ?, name = ? WHERE id = ?
 */
router.put('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const existing = findById(registrations, id);
  if (!existing) {
    return res.status(404).json({ error: 'Registration not found.' });
  }

  const updates = {};
  const { name, status, curp, address, englishLevel } = req.body;

  if (name !== undefined) {
    if (!isValidString(name)) {
      return res.status(400).json({ error: 'Name must be a non-empty string (max 200 chars).' });
    }
    updates.name = name.trim();
  }
  if (status !== undefined) {
    if (!VALID_REG_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${VALID_REG_STATUSES.join(', ')}` });
    }
    updates.status = status;
  }
  if (curp !== undefined) {
    updates.curp = (curp || '').trim();
  }
  if (address !== undefined) {
    updates.address = (address || '').trim();
  }
  if (englishLevel !== undefined) {
    if (englishLevel !== '' && !VALID_LEVELS.includes(englishLevel)) {
      return res.status(400).json({ error: `English level must be one of: ${VALID_LEVELS.join(', ')}` });
    }
    updates.englishLevel = englishLevel;
  }

  const updated = updateItem(registrations, id, updates);
  res.json(updated);
});

/**
 * DELETE /api/admin/registrations/:id
 * Remove a registration.
 * TODO(db): DELETE FROM registrations WHERE id = ?
 */
router.delete('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const removed = deleteItem(registrations, id);
  if (!removed) {
    return res.status(404).json({ error: 'Registration not found.' });
  }
  res.json({ message: 'Registration removed.' });
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMETABLES
// ═══════════════════════════════════════════════════════════════════════════

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const VALID_TIME_SLOTS = ['08:00 - 09:30', '10:00 - 11:30', '12:00 - 13:30', '14:00 - 15:30'];

/**
 * GET /api/admin/timetables
 * Return the full timetable grid structured by day.
 * TODO(db): SELECT * FROM timetable_slots ORDER BY day, time_slot
 */
router.get('/timetables', (_req, res) => {
  // Group by day for the frontend table
  const grid = VALID_DAYS.map((day) => {
    const daySlots = timetableSlots.filter((slot) => slot.day === day);
    // Sort by time slot order
    daySlots.sort((a, b) => VALID_TIME_SLOTS.indexOf(a.timeSlot) - VALID_TIME_SLOTS.indexOf(b.timeSlot));
    return {
      day,
      slots: daySlots.map((slot) => ({
        id: slot.id,
        timeSlot: slot.timeSlot,
        activity: slot.activity,
        room: slot.room,
        groupId: slot.groupId,
      })),
    };
  });

  res.json({ times: VALID_TIME_SLOTS, timetable: grid });
});

/**
 * PUT /api/admin/timetables/:id
 * Update a single timetable slot.
 * TODO(db): UPDATE timetable_slots SET activity = ?, room = ?, group_id = ? WHERE id = ?
 */
router.put('/timetables/:id', (req, res) => {
  const { id } = req.params;
  const existing = findById(timetableSlots, id);
  if (!existing) {
    return res.status(404).json({ error: 'Timetable slot not found.' });
  }

  const { activity, room, groupId } = req.body;
  const updates = {};

  if (activity !== undefined) {
    if (typeof activity !== 'string' || activity.length > MAX_STRING_LENGTH) {
      return res.status(400).json({ error: 'Activity must be a string (max 200 chars).' });
    }
    updates.activity = activity.trim();
  }
  if (room !== undefined) {
    if (room !== null && (typeof room !== 'string' || room.length > MAX_STRING_LENGTH)) {
      return res.status(400).json({ error: 'Room must be a string or null (max 200 chars).' });
    }
    updates.room = room ? room.trim() : null;
  }
  if (groupId !== undefined) {
    if (groupId !== null && !findById(groups, groupId)) {
      return res.status(400).json({ error: 'Group not found.' });
    }
    updates.groupId = groupId;
  }

  const updated = updateItem(timetableSlots, id, updates);
  res.json(updated);
});

// ═══════════════════════════════════════════════════════════════════════════
// CLASSES (English-level groups)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/admin/classes
 * List all English-level groups with teacher name resolved.
 * TODO(db): SELECT g.*, t.name AS teacher FROM groups g JOIN teachers t ON g.teacher_id = t.id
 */
router.get('/classes', (_req, res) => {
  const enriched = groups.map((group) => {
    const teacher = findById(teachers, group.teacherId);
    return {
      ...group,
      teacher: teacher ? teacher.name : 'Unassigned',
    };
  });
  res.json(enriched);
});

/**
 * POST /api/admin/classes
 * Create a new English-level class/group.
 * TODO(db): INSERT INTO groups (level, title, room, teacher_id, student_count, period, focus) VALUES (?, ?, ?, ?, ?, ?, ?)
 */
router.post('/classes', (req, res) => {
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
  if (teacherId && !findById(teachers, teacherId)) {
    return res.status(400).json({ error: 'Teacher not found.' });
  }

  const newGroup = {
    id: generateId('grp-'),
    level,
    title: title.trim(),
    room: room.trim(),
    teacherId: teacherId || null,
    studentCount: typeof studentCount === 'number' && studentCount >= 0 ? studentCount : 0,
    period: (period || '').trim(),
    focus: (focus || '').trim(),
  };

  addItem(groups, newGroup);
  res.status(201).json(newGroup);
});

/**
 * PUT /api/admin/classes/:id
 * Update an English-level class/group.
 * TODO(db): UPDATE groups SET ... WHERE id = ?
 */
router.put('/classes/:id', (req, res) => {
  const { id } = req.params;
  const existing = findById(groups, id);
  if (!existing) {
    return res.status(404).json({ error: 'Class not found.' });
  }

  const updates = {};
  const { level, title, room, teacherId, studentCount, period, focus } = req.body;

  if (level !== undefined) {
    if (!VALID_LEVELS.includes(level)) {
      return res.status(400).json({ error: `Level must be one of: ${VALID_LEVELS.join(', ')}` });
    }
    updates.level = level;
  }
  if (title !== undefined) {
    if (!isValidString(title)) return res.status(400).json({ error: 'Title must be a non-empty string.' });
    updates.title = title.trim();
  }
  if (room !== undefined) {
    if (!isValidString(room)) return res.status(400).json({ error: 'Room must be a non-empty string.' });
    updates.room = room.trim();
  }
  if (teacherId !== undefined) {
    if (teacherId !== null && !findById(teachers, teacherId)) {
      return res.status(400).json({ error: 'Teacher not found.' });
    }
    updates.teacherId = teacherId;
  }
  if (studentCount !== undefined) {
    if (typeof studentCount !== 'number' || studentCount < 0) {
      return res.status(400).json({ error: 'Student count must be a non-negative number.' });
    }
    updates.studentCount = studentCount;
  }
  if (period !== undefined) updates.period = (period || '').trim();
  if (focus !== undefined) updates.focus = (focus || '').trim();

  const updated = updateItem(groups, id, updates);
  res.json(updated);
});

/**
 * DELETE /api/admin/classes/:id
 * Remove an English-level class/group.
 * TODO(db): DELETE FROM groups WHERE id = ?
 */
router.delete('/classes/:id', (req, res) => {
  const { id } = req.params;
  const removed = deleteItem(groups, id);
  if (!removed) {
    return res.status(404).json({ error: 'Class not found.' });
  }
  res.json({ message: 'Class removed.' });
});

export default router;
