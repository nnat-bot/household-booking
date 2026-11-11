const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    return res.status(400).json({ error: 'Please give a rating' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'The rating must be between 1 and 5' });
  }

  try {
    const found = await pool.query('select * from bookings where id = $1', [bookingId]);
    if (found.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = found.rows[0];
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'This booking is not yours' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'You can only review a finished booking' });
    }

    const old = await pool.query('select id from reviews where booking_id = $1', [bookingId]);
    if (old.rows.length > 0) {
      return res.status(400).json({ error: 'You already reviewed this booking' });
    }

    const result = await pool.query(
      'insert into reviews (booking_id, rating, comment) values ($1, $2, $3) returning *',
      [bookingId, rating, comment],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the review' });
  }
});

module.exports = router;
