const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

async function isMyBooking(bookingId, userId) {
  const result = await pool.query(
    'select customer_id, provider_id from bookings where id = $1',
    [bookingId],
  );
  if (result.rows.length === 0) {
    return false;
  }

  const booking = result.rows[0];
  return booking.customer_id === userId || booking.provider_id === userId;
}

router.get('/:bookingId', auth, async (req, res) => {
  try {
    if (!(await isMyBooking(req.params.bookingId, req.user.id))) {
      return res.status(403).json({ error: 'This chat is not yours' });
    }

    const result = await pool.query(
      `select m.id, m.sender_id, m.body, m.created_at, u.name as sender_name
       from messages m
       join users u on u.id = m.sender_id
       where m.booking_id = $1
       order by m.created_at, m.id`,
      [req.params.bookingId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the messages' });
  }
});

router.post('/:bookingId', auth, async (req, res) => {
  const body = req.body.body;
  if (!body || body.trim() === '') {
    return res.status(400).json({ error: 'The message is empty' });
  }

  try {
    if (!(await isMyBooking(req.params.bookingId, req.user.id))) {
      return res.status(403).json({ error: 'This chat is not yours' });
    }

    const result = await pool.query(
      `insert into messages (booking_id, sender_id, body)
       values ($1, $2, $3)
       returning id, sender_id, body, created_at`,
      [req.params.bookingId, req.user.id, body.trim()],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not send the message' });
  }
});

module.exports = router;
