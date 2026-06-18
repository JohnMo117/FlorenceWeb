import express from 'express';
import mysql from 'mysql2/promise'; // Import mysql2/promise for async/await
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the old public directory if needed for backward compatibility
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Example API route using the db config from server2.js
// Database configuration placeholder
/*
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wordslist'
};
*/

// In production, serve the React app
// For development, we run Vite on a separate port (5173) and proxy /api requests to this Express server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
} else {
  // If not production, we don't serve the React index from Express.
  // We just let the API run.
  app.get('/', (req, res) => {
    res.send('API is running. In development mode, please run the Vite dev server (npm run dev inside the client folder).');
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});