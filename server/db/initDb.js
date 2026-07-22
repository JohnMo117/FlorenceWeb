/**
 * FlorenceWeb — Database Initialization Script
 *
 * Connects to MySQL, creates the Escuela_Ingles database if missing,
 * executes schema.sql to set up tables, and seeds initial users with bcrypt hashes.
 *
 * Usage: node server/db/initDb.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initDb() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'admin12345';
  const database = process.env.DB_NAME || 'Escuela_Ingles';

  console.log(`Connecting to MySQL server at ${host}:${port} as user '${user}'...`);

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  try {
    console.log(`Ensuring database '${database}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${database}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading SQL schema file from: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema and seed statements...');
    await connection.query(sql);

    // Seed test users with bcrypt hashes
    console.log('Seeding user accounts for all seeded profiles...');
    const adminHash = await bcrypt.hash('Admin123!', 10);
    const teacherHash = await bcrypt.hash('Teacher123!', 10);
    const studentHash = await bcrypt.hash('Student123!', 10);

    // 1. Insert Admin
    await connection.query(
      `INSERT IGNORE INTO users (id, username, email, password_hash, role, ref_id) VALUES (?, ?, ?, ?, ?, ?)`,
      ['usr-admin-1', 'admin', 'admin@florence.edu', adminHash, 'Admin', null]
    );

    // 2. Fetch all teachers and create accounts
    const [teachers] = await connection.query('SELECT id, name, email FROM teachers');
    for (const t of teachers) {
      const username = t.email.split('@')[0];
      await connection.query(
        `INSERT IGNORE INTO users (id, username, email, password_hash, role, ref_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [`usr-teacher-${t.id}`, username, t.email, teacherHash, 'Teacher', t.id]
      );
    }

    // 3. Fetch all students and create accounts
    const [students] = await connection.query('SELECT id, name, email FROM students');
    for (const s of students) {
      const username = s.email.split('@')[0];
      await connection.query(
        `INSERT IGNORE INTO users (id, username, email, password_hash, role, ref_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [`usr-student-${s.id}`, username, s.email, studentHash, 'Student', s.id]
      );
    }

    console.log('✅ Database initialization and user seeding completed successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

initDb();
