/**
 * FlorenceWeb — In-memory mock data store
 *
 * Every function that reads or writes data is annotated with:
 *   // TODO(db): replace with mysql2 parameterized query
 *
 * When the MySQL database is mounted, swap each helper for a real query
 * using mysql2/promise with prepared statements. Never use string concatenation.
 *
 * TODO(security): When JWT auth is added, remove the mock teacherId / studentId
 * query-param approach and derive identity from the verified token instead.
 */

// ---------------------------------------------------------------------------
// ID generator (replace with DB auto-increment / UUID)
// ---------------------------------------------------------------------------
let _idCounter = 1000;
export function generateId(prefix = '') {
  // TODO(db): let the database generate IDs (AUTO_INCREMENT or UUID)
  _idCounter += 1;
  return `${prefix}${_idCounter}`;
}

// ---------------------------------------------------------------------------
// Teachers
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE teachers (id, name, email, subject)
export const teachers = [
  { id: 'T1', name: 'Marta Ruiz', email: 'marta@florence.edu', subject: 'English' },
  { id: 'T2', name: 'Luis Gomez', email: 'luis@florence.edu', subject: 'English' },
  { id: 'T3', name: 'Ana Torres', email: 'ana@florence.edu', subject: 'English' },
  { id: 'T4', name: 'Sara Lopez', email: 'sara@florence.edu', subject: 'English' },
];

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE students (id, name, email, curp, address, english_level)
export const students = [
  { id: 'S1', name: 'Ana Rivera', email: 'ana.r@florence.edu', curp: 'RIVA040101HDFRNA01', address: 'Calle Hidalgo 12, CDMX', englishLevel: 'A1' },
  { id: 'S2', name: 'Marco Silva', email: 'marco.s@florence.edu', curp: 'SILM030515HDFRRC02', address: 'Av. Reforma 45, CDMX', englishLevel: 'A1' },
  { id: 'S3', name: 'Lina Torres', email: 'lina.t@florence.edu', curp: 'TORL050220MDFRNA03', address: 'Calle Juárez 8, CDMX', englishLevel: 'A1' },
  { id: 'S4', name: 'Diego Costa', email: 'diego.c@florence.edu', curp: 'COSD040830HDFGGA04', address: 'Calle Madero 22, CDMX', englishLevel: 'B1' },
  { id: 'S5', name: 'Sara Gomez', email: 'sara.g@florence.edu', curp: 'GOMS031112MDFMRA05', address: 'Av. Insurgentes 99, CDMX', englishLevel: 'B1' },
  { id: 'S6', name: 'Hugo Martín', email: 'hugo.m@florence.edu', curp: 'MARH050615HDFRGA06', address: 'Calle Morelos 5, CDMX', englishLevel: 'B1' },
  { id: 'S7', name: 'Paula Ruiz', email: 'paula.r@florence.edu', curp: 'RUIP040320MDFRLA07', address: 'Calle Allende 18, CDMX', englishLevel: 'C1' },
  { id: 'S8', name: 'Nora Alvarez', email: 'nora.a@florence.edu', curp: 'ALVN030705MDFLRA08', address: 'Av. Universidad 67, CDMX', englishLevel: 'C1' },
  { id: 'S9', name: 'Leo Blanco', email: 'leo.b@florence.edu', curp: 'BLAL050901HDFNCA09', address: 'Calle Victoria 3, CDMX', englishLevel: 'C1' },
];

// ---------------------------------------------------------------------------
// Groups (English-level classes)
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE groups (id, level, title, room, teacher_id, student_count, period, focus)
export const groups = [
  { id: 'grp-A1', level: 'A1', title: 'Beginners', room: 'Room 101', teacherId: 'T1', studentCount: 24, period: 'Quarter 4', focus: 'Introduction to English' },
  { id: 'grp-A2', level: 'A2', title: 'Elementary', room: 'Room 102', teacherId: 'T4', studentCount: 20, period: 'Quarter 4', focus: 'Everyday English' },
  { id: 'grp-B1', level: 'B1', title: 'Intermediate', room: 'Room 203', teacherId: 'T2', studentCount: 21, period: 'Quarter 4', focus: 'Intermediate English' },
  { id: 'grp-C1', level: 'C1', title: 'Advanced', room: 'Room 305', teacherId: 'T3', studentCount: 18, period: 'Quarter 4', focus: 'Essay writing' },
];

// ---------------------------------------------------------------------------
// Student ↔ Group enrolment (many-to-many)
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE student_groups (student_id, group_id)
export const studentGroups = [
  // A1 students
  { studentId: 'S1', groupId: 'grp-A1' },
  { studentId: 'S2', groupId: 'grp-A1' },
  { studentId: 'S3', groupId: 'grp-A1' },
  // B1 students
  { studentId: 'S4', groupId: 'grp-B1' },
  { studentId: 'S5', groupId: 'grp-B1' },
  { studentId: 'S6', groupId: 'grp-B1' },
  // C1 students
  { studentId: 'S7', groupId: 'grp-C1' },
  { studentId: 'S8', groupId: 'grp-C1' },
  { studentId: 'S9', groupId: 'grp-C1' },
];

// ---------------------------------------------------------------------------
// Timetable slots (shared view — admin can edit, teacher/student read-only)
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE timetable_slots (id, day, time_slot, group_id, room, activity)
export const timetableSlots = [
  // Monday
  { id: 'ts-1', day: 'Monday', timeSlot: '08:00 - 09:30', groupId: 'grp-A1', room: 'Room 101', activity: 'A1 - Room 101' },
  { id: 'ts-2', day: 'Monday', timeSlot: '10:00 - 11:30', groupId: 'grp-B1', room: 'Room 203', activity: 'B1 - Room 203' },
  { id: 'ts-3', day: 'Monday', timeSlot: '12:00 - 13:30', groupId: 'grp-C1', room: 'Room 305', activity: 'C1 - Room 305' },
  { id: 'ts-4', day: 'Monday', timeSlot: '14:00 - 15:30', groupId: null, room: null, activity: 'Support block' },
  // Tuesday
  { id: 'ts-5', day: 'Tuesday', timeSlot: '08:00 - 09:30', groupId: 'grp-A2', room: 'Room 102', activity: 'A2 - Room 102' },
  { id: 'ts-6', day: 'Tuesday', timeSlot: '10:00 - 11:30', groupId: 'grp-B1', room: 'Room 204', activity: 'B2 - Room 204' },
  { id: 'ts-7', day: 'Tuesday', timeSlot: '12:00 - 13:30', groupId: 'grp-C1', room: 'Room 305', activity: 'C1 - Room 305' },
  { id: 'ts-8', day: 'Tuesday', timeSlot: '14:00 - 15:30', groupId: null, room: null, activity: 'Registration block' },
  // Wednesday
  { id: 'ts-9', day: 'Wednesday', timeSlot: '08:00 - 09:30', groupId: 'grp-A1', room: 'Room 101', activity: 'A1 - Room 101' },
  { id: 'ts-10', day: 'Wednesday', timeSlot: '10:00 - 11:30', groupId: 'grp-B1', room: 'Room 203', activity: 'B1 - Room 203' },
  { id: 'ts-11', day: 'Wednesday', timeSlot: '12:00 - 13:30', groupId: 'grp-B1', room: 'Room 204', activity: 'B2 - Room 204' },
  { id: 'ts-12', day: 'Wednesday', timeSlot: '14:00 - 15:30', groupId: null, room: null, activity: 'Assessment review' },
  // Thursday
  { id: 'ts-13', day: 'Thursday', timeSlot: '08:00 - 09:30', groupId: 'grp-A2', room: 'Room 102', activity: 'A2 - Room 102' },
  { id: 'ts-14', day: 'Thursday', timeSlot: '10:00 - 11:30', groupId: 'grp-B1', room: 'Room 203', activity: 'B1 - Room 203' },
  { id: 'ts-15', day: 'Thursday', timeSlot: '12:00 - 13:30', groupId: 'grp-C1', room: 'Room 305', activity: 'C1 - Room 305' },
  { id: 'ts-16', day: 'Thursday', timeSlot: '14:00 - 15:30', groupId: null, room: null, activity: 'Teacher planning' },
  // Friday
  { id: 'ts-17', day: 'Friday', timeSlot: '08:00 - 09:30', groupId: 'grp-A1', room: 'Room 101', activity: 'A1 - Room 101' },
  { id: 'ts-18', day: 'Friday', timeSlot: '10:00 - 11:30', groupId: 'grp-A2', room: 'Room 102', activity: 'A2 - Room 102' },
  { id: 'ts-19', day: 'Friday', timeSlot: '12:00 - 13:30', groupId: 'grp-B1', room: 'Room 204', activity: 'B2 - Room 204' },
  { id: 'ts-20', day: 'Friday', timeSlot: '14:00 - 15:30', groupId: null, room: null, activity: 'Open office hour' },
];

// ---------------------------------------------------------------------------
// Grades
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE grades (id, student_id, student_name, group_id, assessment, score, status, updated_at)
export const grades = [
  // A1 grades
  { id: 'g-1', studentId: 'S1', studentName: 'Ana Rivera', groupId: 'grp-A1', assessment: 'Unit 3 Quiz', score: 8.9, status: 'Published', updatedAt: 'Today' },
  { id: 'g-2', studentId: 'S2', studentName: 'Marco Silva', groupId: 'grp-A1', assessment: 'Project Draft', score: 7.4, status: 'Pending', updatedAt: 'Yesterday' },
  { id: 'g-3', studentId: 'S3', studentName: 'Lina Torres', groupId: 'grp-A1', assessment: 'Midterm Review', score: 9.2, status: 'Published', updatedAt: '2 days ago' },
  // B1 grades
  { id: 'g-4', studentId: 'S4', studentName: 'Diego Costa', groupId: 'grp-B1', assessment: 'Lab Report', score: 8.1, status: 'Published', updatedAt: 'Today' },
  { id: 'g-5', studentId: 'S5', studentName: 'Sara Gomez', groupId: 'grp-B1', assessment: 'Quiz 5', score: 6.8, status: 'Needs review', updatedAt: 'Yesterday' },
  { id: 'g-6', studentId: 'S6', studentName: 'Hugo Martín', groupId: 'grp-B1', assessment: 'Lab Report', score: 9.0, status: 'Published', updatedAt: '3 days ago' },
  // C1 grades
  { id: 'g-7', studentId: 'S7', studentName: 'Paula Ruiz', groupId: 'grp-C1', assessment: 'Essay 2', score: 9.4, status: 'Published', updatedAt: 'Today' },
  { id: 'g-8', studentId: 'S8', studentName: 'Nora Alvarez', groupId: 'grp-C1', assessment: 'Reading Response', score: 8.5, status: 'Pending', updatedAt: 'Yesterday' },
  { id: 'g-9', studentId: 'S9', studentName: 'Leo Blanco', groupId: 'grp-C1', assessment: 'Essay 2', score: 7.9, status: 'Published', updatedAt: '2 days ago' },
  // Student-facing grades (simplified: subject-based view)
  { id: 'g-10', studentId: 'S1', studentName: 'Ana Rivera', groupId: 'grp-A1', assessment: 'Reading', score: 8.9, status: 'Published', updatedAt: 'Today', note: 'Excellent comprehension' },
  { id: 'g-11', studentId: 'S1', studentName: 'Ana Rivera', groupId: 'grp-A1', assessment: 'Writing', score: 7.8, status: 'Published', updatedAt: 'Yesterday', note: 'Good structure and clarity' },
  { id: 'g-12', studentId: 'S1', studentName: 'Ana Rivera', groupId: 'grp-A1', assessment: 'Listening', score: 8.4, status: 'Published', updatedAt: '2 days ago', note: 'Teacher feedback pending' },
];

// ---------------------------------------------------------------------------
// Announcements (broadcasts)
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE announcements (id, teacher_id, title, audience, message, created_at)
export const announcements = [
  {
    id: 'ann-1',
    teacherId: 'T1',
    title: 'Welcome to this week',
    audience: 'All students',
    message: 'Please review Unit 5 notes before Thursday. We will open with a quick quiz.',
    createdAt: 'Today at 08:30',
  },
  {
    id: 'ann-2',
    teacherId: 'T2',
    title: 'Homework reminder',
    audience: 'B1 Intermediate',
    message: 'Please review Unit 4 before Thursday. Short quiz at the start of class.',
    createdAt: 'Today at 08:30',
  },
  {
    id: 'ann-3',
    teacherId: 'T3',
    title: 'Room change',
    audience: 'A2 Everyday English',
    message: "Tomorrow's lesson will move to the main hall for a special event.",
    createdAt: 'Yesterday',
  },
];

// ---------------------------------------------------------------------------
// Registrations (admin onboarding queue)
// ---------------------------------------------------------------------------
// TODO(db): CREATE TABLE registrations (id, name, role, status, curp, address, english_level)
export const registrations = [
  { id: 'reg-1', name: 'Laura Perez', role: 'Student', status: 'Pending documents', curp: '', address: '', englishLevel: 'A1' },
  { id: 'reg-2', name: 'Miguel Ortega', role: 'Teacher', status: 'Profile review', curp: '', address: '', englishLevel: '' },
  { id: 'reg-3', name: 'Sofia Herrera', role: 'Student', status: 'Payment check', curp: '', address: '', englishLevel: 'B1' },
  { id: 'reg-4', name: 'Carlos Vega', role: 'Teacher', status: 'Contract draft', curp: '', address: '', englishLevel: '' },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Find an item by ID in any collection.
 * TODO(db): replace with SELECT ... WHERE id = ?
 */
export function findById(collection, id) {
  return collection.find((item) => item.id === id) || null;
}

/**
 * Add an item to a collection and return it.
 * TODO(db): replace with INSERT INTO ...
 */
export function addItem(collection, item) {
  collection.push(item);
  return item;
}

/**
 * Update an item in a collection by ID. Returns the updated item or null.
 * TODO(db): replace with UPDATE ... WHERE id = ?
 */
export function updateItem(collection, id, updates) {
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updates };
  return collection[index];
}

/**
 * Delete an item from a collection by ID. Returns true if removed.
 * TODO(db): replace with DELETE FROM ... WHERE id = ?
 */
export function deleteItem(collection, id) {
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
}
