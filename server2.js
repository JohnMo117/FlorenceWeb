import express from 'express';
import mysql from 'mysql2/promise'; // Import mysql2/promise for async/await
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database configuration
const dbConfig = {
  host: 'localhost', // Replace with your host
  user: 'root',       // Replace with your username
  password: 'admin12345',   // Replace with your password
  database: 'Escuela_Ingles'
};

// Route to render the index page and fetch the MySQL version
app.get('/', async (req, res) => {
  let mysqlVersion = null;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT VERSION()');
    if (rows.length > 0) {
      mysqlVersion = rows[0]['VERSION()'];
      console.log(`MySQL Version: ${mysqlVersion}`);
    }
    await connection.close();
  } catch (error) {
    console.error('Database query failed', error);
    // Handle the error appropriately, maybe send an error message to the client
    mysqlVersion = 'Error fetching MySQL version';
  }

  res.render('index', { mysqlVersion: mysqlVersion });
});

app.get('/test', (req, res) => {
  res.render('test');
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});