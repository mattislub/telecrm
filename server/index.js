import express from 'express';
import mysql from 'mysql2/promise';
import fs from 'fs';
import https from 'https';

export const app = express();
app.use(express.json());

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

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
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/calls', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM calls LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/call.php', async (req, res) => {
  const { phonenumber, callerid, calltype, verificationcode, ringtimeout } = req.body;

  if (!phonenumber || !callerid || !calltype) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // This is a stub implementation. In a real system this would trigger the
  // telephony provider and store the request in the database.
  console.log('Incoming verification call', {
    phonenumber,
    callerid,
    calltype,
    verificationcode,
    ringtimeout
  });

  res.json({ message: 'Success', status: 'Call Initiated.' });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 3001;

  if (process.env.SSL_KEY && process.env.SSL_CERT) {
    const key = fs.readFileSync(process.env.SSL_KEY);
    const cert = fs.readFileSync(process.env.SSL_CERT);
    https.createServer({ key, cert }, app).listen(PORT, () => {
      console.log(`HTTPS server listening on port ${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
}
