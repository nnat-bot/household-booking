const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

const TOKEN_LIFETIME = '7d';

function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });
}

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Please fill in all the fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'The password needs at least 6 characters' });
  }
  if (role !== 'customer' && role !== 'provider') {
    return res.status(400).json({ error: 'Role must be customer or provider' });
  }

  const address = email.trim().toLowerCase();

  try {
    const found = await pool.query('select id from users where email = $1', [address]);
    if (found.rows.length > 0) {
      return res.status(400).json({ error: 'This email is already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `insert into users (name, email, password_hash, role)
       values ($1, $2, $3, $4)
       returning id, name, email, role`,
      [name, address, hash, role],
    );

    const user = result.rows[0];
    res.status(201).json({ user, token: makeToken(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please fill in email and password' });
  }

  const address = email.trim().toLowerCase();

  try {
    const result = await pool.query('select * from users where email = $1', [address]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    const user = result.rows[0];
    const passwordOk = await bcrypt.compare(password, user.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: makeToken(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'select id, name, email, role, avatar_url, bio, hourly_rate from users where id = $1',
      [req.user.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
