-- =============================================================================
-- FlorenceWeb — Database Schema & Initial Data Seed
-- Database: Escuela_Ingles
-- =============================================================================

CREATE DATABASE IF NOT EXISTS Escuela_Ingles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Escuela_Ingles;

-- -----------------------------------------------------------------------------
-- 1. Table: teachers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  subject VARCHAR(100) DEFAULT 'English',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. Table: students
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  curp VARCHAR(18),
  address TEXT,
  english_level ENUM('A1', 'A2', 'B1', 'B2', 'C1') DEFAULT 'A1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 3. Table: `groups` (English-level classes - backticked because GROUPS is reserved in MySQL 8)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `groups` (
  id VARCHAR(50) PRIMARY KEY,
  level ENUM('A1', 'A2', 'B1', 'B2', 'C1') NOT NULL,
  title VARCHAR(200) NOT NULL,
  room VARCHAR(100) NOT NULL,
  teacher_id VARCHAR(50),
  student_count INT DEFAULT 0,
  period VARCHAR(100) DEFAULT 'Quarter 4',
  focus VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 4. Table: student_groups (Student ↔ Group enrollment many-to-many)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_groups (
  student_id VARCHAR(50) NOT NULL,
  group_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id, group_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 5. Table: timetable_slots
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS timetable_slots (
  id VARCHAR(50) PRIMARY KEY,
  group_id VARCHAR(50) NOT NULL,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  room VARCHAR(100),
  activity VARCHAR(200),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 6. Table: grades
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grades (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50),
  student_name VARCHAR(200) NOT NULL,
  group_id VARCHAR(50) NOT NULL,
  assessment VARCHAR(200) NOT NULL,
  score DECIMAL(4, 2) NOT NULL,
  status ENUM('Published', 'Pending', 'Needs review') DEFAULT 'Pending',
  note TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 7. Table: announcements
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  teacher_id VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  audience VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at VARCHAR(100) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 8. Table: registrations (Admin onboarding queue)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  role ENUM('Student', 'Teacher') NOT NULL,
  status ENUM('Pending documents', 'Profile review', 'Payment check', 'Contract draft', 'Approved', 'Rejected') DEFAULT 'Pending documents',
  curp VARCHAR(18),
  address TEXT,
  english_level VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 9. Table: users (Authentication readiness)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Teacher', 'Student') NOT NULL,
  ref_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================================
-- SEED DATA INSERTS
-- =============================================================================

INSERT IGNORE INTO teachers (id, name, email, subject) VALUES
  ('T1', 'Marta Ruiz', 'marta@florence.edu', 'English'),
  ('T2', 'Luis Gomez', 'luis@florence.edu', 'English'),
  ('T3', 'Ana Torres', 'ana@florence.edu', 'English'),
  ('T4', 'Sara Lopez', 'sara@florence.edu', 'English');

INSERT IGNORE INTO students (id, name, email, curp, address, english_level) VALUES
  ('S1', 'Ana Rivera', 'ana.r@florence.edu', 'RIVA040101HDFRNA01', 'Calle Hidalgo 12, CDMX', 'A1'),
  ('S2', 'Marco Silva', 'marco.s@florence.edu', 'SILM030515HDFRRC02', 'Av. Reforma 45, CDMX', 'A1'),
  ('S3', 'Lina Torres', 'lina.t@florence.edu', 'TORL050220MDFRNA03', 'Calle Juárez 8, CDMX', 'A1'),
  ('S4', 'Diego Costa', 'diego.c@florence.edu', 'COSD040830HDFGGA04', 'Calle Madero 22, CDMX', 'B1'),
  ('S5', 'Sara Gomez', 'sara.g@florence.edu', 'GOMS031112MDFMRA05', 'Av. Insurgentes 99, CDMX', 'B1'),
  ('S6', 'Hugo Martín', 'hugo.m@florence.edu', 'MARH050615HDFRGA06', 'Calle Morelos 5, CDMX', 'B1'),
  ('S7', 'Paula Ruiz', 'paula.r@florence.edu', 'RUIP040320MDFRLA07', 'Calle Allende 18, CDMX', 'C1'),
  ('S8', 'Nora Alvarez', 'nora.a@florence.edu', 'ALVN030705MDFLRA08', 'Av. Universidad 67, CDMX', 'C1'),
  ('S9', 'Leo Blanco', 'leo.b@florence.edu', 'BLAL050901HDFNCA09', 'Calle Victoria 3, CDMX', 'C1');

INSERT IGNORE INTO `groups` (id, level, title, room, teacher_id, student_count, period, focus) VALUES
  ('grp-A1', 'A1', 'Beginners', 'Room 101', 'T1', 24, 'Quarter 4', 'Introduction to English'),
  ('grp-A2', 'A2', 'Elementary', 'Room 102', 'T4', 20, 'Quarter 4', 'Everyday English'),
  ('grp-B1', 'B1', 'Intermediate', 'Room 203', 'T2', 21, 'Quarter 4', 'Intermediate English'),
  ('grp-C1', 'C1', 'Advanced', 'Room 305', 'T3', 18, 'Quarter 4', 'Essay writing');

INSERT IGNORE INTO student_groups (student_id, group_id) VALUES
  ('S1', 'grp-A1'),
  ('S2', 'grp-A1'),
  ('S3', 'grp-A1'),
  ('S4', 'grp-B1'),
  ('S5', 'grp-B1'),
  ('S6', 'grp-B1'),
  ('S7', 'grp-C1'),
  ('S8', 'grp-C1'),
  ('S9', 'grp-C1');

INSERT IGNORE INTO timetable_slots (id, group_id, day, time_slot, room, activity) VALUES
  ('ts-a1-mon-1', 'grp-A1', 'Monday',    '08:00 - 09:30', 'Room 101', 'Grammar fundamentals'),
  ('ts-a1-mon-2', 'grp-A1', 'Monday',    '10:00 - 11:30', 'Room 101', 'Vocabulary building'),
  ('ts-a1-mon-3', 'grp-A1', 'Monday',    '12:00 - 13:30', NULL,       ''),
  ('ts-a1-mon-4', 'grp-A1', 'Monday',    '14:00 - 15:30', NULL,       ''),
  ('ts-a1-tue-1', 'grp-A1', 'Tuesday',   '08:00 - 09:30', NULL,       ''),
  ('ts-a1-tue-2', 'grp-A1', 'Tuesday',   '10:00 - 11:30', NULL,       ''),
  ('ts-a1-tue-3', 'grp-A1', 'Tuesday',   '12:00 - 13:30', NULL,       ''),
  ('ts-a1-tue-4', 'grp-A1', 'Tuesday',   '14:00 - 15:30', NULL,       ''),
  ('ts-a1-wed-1', 'grp-A1', 'Wednesday', '08:00 - 09:30', 'Room 101', 'Reading comprehension'),
  ('ts-a1-wed-2', 'grp-A1', 'Wednesday', '10:00 - 11:30', 'Room 101', 'Listening practice'),
  ('ts-a1-wed-3', 'grp-A1', 'Wednesday', '12:00 - 13:30', NULL,       ''),
  ('ts-a1-wed-4', 'grp-A1', 'Wednesday', '14:00 - 15:30', NULL,       ''),
  ('ts-a1-thu-1', 'grp-A1', 'Thursday',  '08:00 - 09:30', NULL,       ''),
  ('ts-a1-thu-2', 'grp-A1', 'Thursday',  '10:00 - 11:30', NULL,       ''),
  ('ts-a1-thu-3', 'grp-A1', 'Thursday',  '12:00 - 13:30', NULL,       ''),
  ('ts-a1-thu-4', 'grp-A1', 'Thursday',  '14:00 - 15:30', NULL,       ''),
  ('ts-a1-fri-1', 'grp-A1', 'Friday',    '08:00 - 09:30', 'Room 101', 'Speaking drills'),
  ('ts-a1-fri-2', 'grp-A1', 'Friday',    '10:00 - 11:30', 'Room 101', 'Week review'),
  ('ts-a1-fri-3', 'grp-A1', 'Friday',    '12:00 - 13:30', NULL,       ''),
  ('ts-a1-fri-4', 'grp-A1', 'Friday',    '14:00 - 15:30', NULL,       ''),

  ('ts-a2-mon-1', 'grp-A2', 'Monday',    '08:00 - 09:30', NULL,       ''),
  ('ts-a2-mon-2', 'grp-A2', 'Monday',    '10:00 - 11:30', NULL,       ''),
  ('ts-a2-mon-3', 'grp-A2', 'Monday',    '12:00 - 13:30', NULL,       ''),
  ('ts-a2-mon-4', 'grp-A2', 'Monday',    '14:00 - 15:30', NULL,       ''),
  ('ts-a2-tue-1', 'grp-A2', 'Tuesday',   '08:00 - 09:30', 'Room 102', 'Everyday phrases'),
  ('ts-a2-tue-2', 'grp-A2', 'Tuesday',   '10:00 - 11:30', 'Room 102', 'Dialogue practice'),
  ('ts-a2-tue-3', 'grp-A2', 'Tuesday',   '12:00 - 13:30', NULL,       ''),
  ('ts-a2-tue-4', 'grp-A2', 'Tuesday',   '14:00 - 15:30', NULL,       ''),
  ('ts-a2-wed-1', 'grp-A2', 'Wednesday', '08:00 - 09:30', NULL,       ''),
  ('ts-a2-wed-2', 'grp-A2', 'Wednesday', '10:00 - 11:30', NULL,       ''),
  ('ts-a2-wed-3', 'grp-A2', 'Wednesday', '12:00 - 13:30', NULL,       ''),
  ('ts-a2-wed-4', 'grp-A2', 'Wednesday', '14:00 - 15:30', NULL,       ''),
  ('ts-a2-thu-1', 'grp-A2', 'Thursday',  '08:00 - 09:30', 'Room 102', 'Writing basics'),
  ('ts-a2-thu-2', 'grp-A2', 'Thursday',  '10:00 - 11:30', 'Room 102', 'Pronunciation lab'),
  ('ts-a2-thu-3', 'grp-A2', 'Thursday',  '12:00 - 13:30', NULL,       ''),
  ('ts-a2-thu-4', 'grp-A2', 'Thursday',  '14:00 - 15:30', NULL,       ''),
  ('ts-a2-fri-1', 'grp-A2', 'Friday',    '08:00 - 09:30', NULL,       ''),
  ('ts-a2-fri-2', 'grp-A2', 'Friday',    '10:00 - 11:30', 'Room 102', 'Culture & context'),
  ('ts-a2-fri-3', 'grp-A2', 'Friday',    '12:00 - 13:30', NULL,       ''),
  ('ts-a2-fri-4', 'grp-A2', 'Friday',    '14:00 - 15:30', NULL,       ''),

  ('ts-b1-mon-1', 'grp-B1', 'Monday',    '08:00 - 09:30', 'Room 203', 'Intermediate grammar'),
  ('ts-b1-mon-2', 'grp-B1', 'Monday',    '10:00 - 11:30', 'Room 203', 'Reading & analysis'),
  ('ts-b1-mon-3', 'grp-B1', 'Monday',    '12:00 - 13:30', NULL,       ''),
  ('ts-b1-mon-4', 'grp-B1', 'Monday',    '14:00 - 15:30', NULL,       ''),
  ('ts-b1-tue-1', 'grp-B1', 'Tuesday',   '08:00 - 09:30', NULL,       ''),
  ('ts-b1-tue-2', 'grp-B1', 'Tuesday',   '10:00 - 11:30', 'Room 203', 'Conversation club'),
  ('ts-b1-tue-3', 'grp-B1', 'Tuesday',   '12:00 - 13:30', 'Room 203', 'Listening skills'),
  ('ts-b1-tue-4', 'grp-B1', 'Tuesday',   '14:00 - 15:30', NULL,       ''),
  ('ts-b1-wed-1', 'grp-B1', 'Wednesday', '08:00 - 09:30', 'Room 203', 'Essay structure'),
  ('ts-b1-wed-2', 'grp-B1', 'Wednesday', '10:00 - 11:30', NULL,       ''),
  ('ts-b1-wed-3', 'grp-B1', 'Wednesday', '12:00 - 13:30', NULL,       ''),
  ('ts-b1-wed-4', 'grp-B1', 'Wednesday', '14:00 - 15:30', NULL,       ''),
  ('ts-b1-thu-1', 'grp-B1', 'Thursday',  '08:00 - 09:30', NULL,       ''),
  ('ts-b1-thu-2', 'grp-B1', 'Thursday',  '10:00 - 11:30', 'Room 203', 'Debate workshop'),
  ('ts-b1-thu-3', 'grp-B1', 'Thursday',  '12:00 - 13:30', 'Room 203', 'Media English'),
  ('ts-b1-thu-4', 'grp-B1', 'Thursday',  '14:00 - 15:30', NULL,       ''),
  ('ts-b1-fri-1', 'grp-B1', 'Friday',    '08:00 - 09:30', NULL,       ''),
  ('ts-b1-fri-2', 'grp-B1', 'Friday',    '10:00 - 11:30', NULL,       ''),
  ('ts-b1-fri-3', 'grp-B1', 'Friday',    '12:00 - 13:30', 'Room 203', 'Week review'),
  ('ts-b1-fri-4', 'grp-B1', 'Friday',    '14:00 - 15:30', NULL,       ''),

  ('ts-c1-mon-1', 'grp-C1', 'Monday',    '08:00 - 09:30', 'Room 305', 'Academic writing'),
  ('ts-c1-mon-2', 'grp-C1', 'Monday',    '10:00 - 11:30', NULL,       ''),
  ('ts-c1-mon-3', 'grp-C1', 'Monday',    '12:00 - 13:30', 'Room 305', 'Critical analysis'),
  ('ts-c1-mon-4', 'grp-C1', 'Monday',    '14:00 - 15:30', NULL,       ''),
  ('ts-c1-tue-1', 'grp-C1', 'Tuesday',   '08:00 - 09:30', NULL,       ''),
  ('ts-c1-tue-2', 'grp-C1', 'Tuesday',   '10:00 - 11:30', 'Room 305', 'Advanced vocabulary'),
  ('ts-c1-tue-3', 'grp-C1', 'Tuesday',   '12:00 - 13:30', NULL,       ''),
  ('ts-c1-tue-4', 'grp-C1', 'Tuesday',   '14:00 - 15:30', NULL,       ''),
  ('ts-c1-wed-1', 'grp-C1', 'Wednesday', '08:00 - 09:30', NULL,       ''),
  ('ts-c1-wed-2', 'grp-C1', 'Wednesday', '10:00 - 11:30', 'Room 305', 'Presentation skills'),
  ('ts-c1-wed-3', 'grp-C1', 'Wednesday', '12:00 - 13:30', 'Room 305', 'Research methods'),
  ('ts-c1-wed-4', 'grp-C1', 'Wednesday', '14:00 - 15:30', NULL,       ''),
  ('ts-c1-thu-1', 'grp-C1', 'Thursday',  '08:00 - 09:30', 'Room 305', 'Literary criticism'),
  ('ts-c1-thu-2', 'grp-C1', 'Thursday',  '10:00 - 11:30', NULL,       ''),
  ('ts-c1-thu-3', 'grp-C1', 'Thursday',  '12:00 - 13:30', NULL,       ''),
  ('ts-c1-thu-4', 'grp-C1', 'Thursday',  '14:00 - 15:30', NULL,       ''),
  ('ts-c1-fri-1', 'grp-C1', 'Friday',    '08:00 - 09:30', NULL,       ''),
  ('ts-c1-fri-2', 'grp-C1', 'Friday',    '10:00 - 11:30', 'Room 305', 'Seminar discussion'),
  ('ts-c1-fri-3', 'grp-C1', 'Friday',    '12:00 - 13:30', NULL,       ''),
  ('ts-c1-fri-4', 'grp-C1', 'Friday',    '14:00 - 15:30', NULL,       '');

INSERT IGNORE INTO grades (id, student_id, student_name, group_id, assessment, score, status, note) VALUES
  ('g-1', 'S1', 'Ana Rivera', 'grp-A1', 'Unit 3 Quiz', 8.9, 'Published', NULL),
  ('g-2', 'S2', 'Marco Silva', 'grp-A1', 'Project Draft', 7.4, 'Pending', NULL),
  ('g-3', 'S3', 'Lina Torres', 'grp-A1', 'Midterm Review', 9.2, 'Published', NULL),
  ('g-4', 'S4', 'Diego Costa', 'grp-B1', 'Lab Report', 8.1, 'Published', NULL),
  ('g-5', 'S5', 'Sara Gomez', 'grp-B1', 'Quiz 5', 6.8, 'Needs review', NULL),
  ('g-6', 'S6', 'Hugo Martín', 'grp-B1', 'Lab Report', 9.0, 'Published', NULL),
  ('g-7', 'S7', 'Paula Ruiz', 'grp-C1', 'Essay 2', 9.4, 'Published', NULL),
  ('g-8', 'S8', 'Nora Alvarez', 'grp-C1', 'Reading Response', 8.5, 'Pending', NULL),
  ('g-9', 'S9', 'Leo Blanco', 'grp-C1', 'Essay 2', 7.9, 'Published', NULL),
  ('g-10', 'S1', 'Ana Rivera', 'grp-A1', 'Reading', 8.9, 'Published', 'Excellent comprehension'),
  ('g-11', 'S1', 'Ana Rivera', 'grp-A1', 'Writing', 7.8, 'Published', 'Good structure and clarity'),
  ('g-12', 'S1', 'Ana Rivera', 'grp-A1', 'Listening', 8.4, 'Published', 'Teacher feedback pending');

INSERT IGNORE INTO announcements (id, teacher_id, title, audience, message, created_at) VALUES
  ('ann-1', 'T1', 'Welcome to this week', 'All students', 'Please review Unit 5 notes before Thursday. We will open with a quick quiz.', 'Today at 08:30'),
  ('ann-2', 'T2', 'Homework reminder', 'B1 Intermediate', 'Please review Unit 4 before Thursday. Short quiz at the start of class.', 'Today at 08:30'),
  ('ann-3', 'T3', 'Room change', 'A2 Everyday English', 'Tomorrow\'s lesson will move to the main hall for a special event.', 'Yesterday');

INSERT IGNORE INTO registrations (id, name, role, status, curp, address, english_level) VALUES
  ('reg-1', 'Laura Perez', 'Student', 'Pending documents', '', '', 'A1'),
  ('reg-2', 'Miguel Ortega', 'Teacher', 'Profile review', '', '', ''),
  ('reg-3', 'Sofia Herrera', 'Student', 'Payment check', '', '', 'B1'),
  ('reg-4', 'Carlos Vega', 'Teacher', 'Contract draft', '', '', '');
