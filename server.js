// reemplaza toda la parte de mssql por esto al inicio:
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET /pins
app.get('/pins', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pins ORDER BY created_at');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /pins
app.post('/pins', async (req, res) => {
  const { type, content } = req.body;
  try {
    await pool.query(
      'INSERT INTO pins(type, content) VALUES($1,$2)',
      [type, content]
    );
    res.status(201).json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
