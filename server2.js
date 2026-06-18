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
  password: '',   // Replace with your password
  database: 'wordslist'
};

// Route to render the index page and fetch a random word
app.get('/', async (req, res) => {
  let randomWord = null;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT word FROM words ORDER BY RAND() LIMIT 1');
    if (rows.length > 0) {
      randomWord = rows[0].word;
    }
    await connection.close();
  } catch (error) {
    console.error('Database query failed', error);
    // Handle the error appropriately, maybe send an error message to the client
    randomWord = 'Error fetching word';
  }

  res.render('index', { randomWord: randomWord });
});

app.get('/test', (req, res) => {
  res.render('test');
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});