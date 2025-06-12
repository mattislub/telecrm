const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// טוען את קובץ .env
dotenv.config();

const app = express();
app.use(express.json());

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
      res.json({ success: true });
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
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
