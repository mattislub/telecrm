import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import { pathToFileURL } from 'url';
import fs from 'fs';
import https from 'https';

// טוען את קובץ .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// חיבור למסד הנתונים
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// התחברות משתמש
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username=? AND password=?',
      [username, password]
    );
    if (rows.length) {
      const user = { id: rows[0].id, username };
      // יצירת אסימון דמה לצורכי דוגמה בלבד
      const token = 'dummy-token';
      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// בקשת שיחות
app.get('/calls', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM calls LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error('Calls error:', err);
    res.status(500).json({ error: 'DB error' });
  }
});

// קריאת אימות (stub)
app.post('/call.php', async (req, res) => {
  const { phonenumber, callerid, calltype, verificationcode, ringtimeout } = req.body;

  if (!phonenumber || !callerid || !calltype) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Incoming verification call', {
    phonenumber,
    callerid,
    calltype,
    verificationcode,
    ringtimeout
  });

  res.json({ message: 'Success', status: 'Call Initiated.' });
});

// הפעלת השרת
const PORT = process.env.PORT || 3001;

// Start the server only when this file is executed directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const useSSL = process.env.USE_SSL === 'true';
  if (useSSL) {
    const keyPath = process.env.SSL_KEY_PATH || 'ssl/key.pem';
    const certPath = process.env.SSL_CERT_PATH || 'ssl/cert.pem';

    const sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log(`HTTPS server listening on port ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}
