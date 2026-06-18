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

app.get('/test', (req, res) => {
  res.render('test');
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});