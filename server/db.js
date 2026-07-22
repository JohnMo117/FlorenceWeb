/**
 * FlorenceWeb — MySQL Database Pool Module
 *
 * Uses mysql2/promise to manage database connections efficiently.
 * Configured with environment variables and defaults matching server2.js config.
 */

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin12345',
  database: process.env.DB_NAME || 'Escuela_Ingles',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Execute a SQL query with parameters.
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Array of parameter values
 * @returns {Promise<[Array, Array]>} Query results
 */
export async function query(sql, params = []) {
  return await pool.query(sql, params);
}

/**
 * Execute a prepared SQL statement.
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Array of parameter values
 * @returns {Promise<[Array, Array]>} Execution results
 */
export async function execute(sql, params = []) {
  return await pool.execute(sql, params);
}

export default pool;
