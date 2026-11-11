const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

async function updateStatus(req, res, options) {
  try {
    const found = await pool.query('select * from bookings where id = $1', [req.params.id]);
    if (found.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = found.rows[0];
    const ownerId = options.role === 'customer' ? booking.customer_id : booking.provider_id;
    if (ownerId !== req.user.id) {
      return res.status(403).json({ error: 'This booking is not yours' });
    }
    if (!options.allowedNow.includes(booking.status)) {
      return res.status(400).json({ error: options.wrongStatus });
    }

    const result = await pool.query(
      'update bookings set status = $1 where id = $2 returning id, status',
      [options.newStatus, req.params.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not change the booking' });
  }
}

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Only customers can make a booking' });
  }

  const { providerId, serviceId, date, startTime, endTime } = req.body;
  if (!providerId || !serviceId || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Some booking details are missing' });
  }

  try {
    const taken = await pool.query(
      `select id from bookings
       where provider_id = $1 and booking_date = $2
       and status in ('pending', 'confirmed')
       and start_time < $4 and end_time > $3`,
      [providerId, date, startTime, endTime],
    );
    if (taken.rows.length > 0) {
      return res.status(400).json({ error: 'This time is already booked' });
    }

    const provider = await pool.query('select hourly_rate from users where id = $1', [providerId]);
    if (provider.rows.length === 0) {
      return res.status(404).json({ error: 'Cleaner not found' });
    }

    const hours = parseInt(endTime.slice(0, 2)) - parseInt(startTime.slice(0, 2));
    const price = provider.rows[0].hourly_rate * hours;

    const result = await pool.query(
      `insert into bookings
         (customer_id, provider_id, service_id, booking_date, start_time, end_time, estimated_price)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, status, to_char(booking_date, 'YYYY-MM-DD') as booking_date,
                 start_time, end_time, estimated_price`,
      [req.user.id, providerId, serviceId, date, startTime, endTime, price],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the booking' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      const result = await pool.query(
        `select b.id, b.status, to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
                b.start_time, b.end_time, b.estimated_price,
                s.title as service_title, s.category,
                p.name as provider_name, p.avatar_url
         from bookings b
         join services s on s.id = b.service_id
         join users p on p.id = b.provider_id
         where b.customer_id = $1
         order by b.booking_date desc`,
        [req.user.id],
      );
      res.json(result.rows);
    } else {
      const result = await pool.query(
        `select b.id, b.status, to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
                b.start_time, b.end_time, b.estimated_price,
                s.title as service_title, s.category,
                c.name as customer_name, c.avatar_url
         from bookings b
         join services s on s.id = b.service_id
         join users c on c.id = b.customer_id
         where b.provider_id = $1
         order by b.booking_date desc`,
        [req.user.id],
      );
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the bookings' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `select b.id, b.status, b.customer_id, b.provider_id,
              to_char(b.booking_date, 'YYYY-MM-DD') as booking_date,
              b.start_time, b.end_time, b.estimated_price,
              s.title as service_title, s.category,
              c.name as customer_name,
              p.name as provider_name, p.avatar_url
       from bookings b
       join services s on s.id = b.service_id
       join users c on c.id = b.customer_id
       join users p on p.id = b.provider_id
       where b.id = $1`,
      [req.params.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];
    if (booking.customer_id !== req.user.id && booking.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'This booking is not yours' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the booking' });
  }
});

router.put('/:id/cancel', auth, (req, res) =>
  updateStatus(req, res, {
    newStatus: 'cancelled',
    allowedNow: ['pending', 'confirmed'],
    role: 'customer',
    wrongStatus: 'This booking cannot be cancelled anymore',
  }),
);

router.put('/:id/accept', auth, (req, res) =>
  updateStatus(req, res, {
    newStatus: 'confirmed',
    allowedNow: ['pending'],
    role: 'provider',
    wrongStatus: 'This request was already answered',
  }),
);

router.put('/:id/decline', auth, (req, res) =>
  updateStatus(req, res, {
    newStatus: 'declined',
    allowedNow: ['pending'],
    role: 'provider',
    wrongStatus: 'This request was already answered',
  }),
);

router.put('/:id/complete', auth, (req, res) =>
  updateStatus(req, res, {
    newStatus: 'completed',
    allowedNow: ['confirmed'],
    role: 'provider',
    wrongStatus: 'Only a confirmed booking can be finished',
  }),
);

module.exports = router;
