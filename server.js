const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get('/pins', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pins ORDER BY created_at');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/pins', async (req, res) => {
  const { type, content } = req.body;
  try {
    await pool.query('INSERT INTO pins(type, content) VALUES($1, $2)', [type, content]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

app.delete('/pins/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM pins WHERE id = $1', [id]);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  