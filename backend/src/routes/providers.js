const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');

const router = express.Router();

const SLOT_LENGTH = 2;

function pad(number) {
  return number < 10 ? '0' + number : '' + number;
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `select u.id, u.name, u.avatar_url, u.bio, u.hourly_rate,
              round(avg(r.rating), 1) as rating,
              count(r.id) as review_count
       from users u
       left join bookings b on b.provider_id = u.id
       left join reviews r on r.booking_id = b.id
       where u.role = 'provider'
       group by u.id
       order by u.name`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the cleaners' });
  }
});

router.get('/me/availability', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'select id, weekday, start_time, end_time from availability where provider_id = $1 order by weekday',
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the working hours' });
  }
});

router.put('/me/availability', auth, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Only cleaners can do this' });
  }

  const hours = req.body.hours;
  if (!Array.isArray(hours)) {
    return res.status(400).json({ error: 'Hours must be a list' });
  }

  try {
    await pool.query('delete from availability where provider_id = $1', [req.user.id]);
    for (const row of hours) {
      await pool.query(
        'insert into availability (provider_id, weekday, start_time, end_time) values ($1, $2, $3, $4)',
        [req.user.id, row.weekday, row.startTime, row.endTime],
      );
    }

    const result = await pool.query(
      'select id, weekday, start_time, end_time from availability where provider_id = $1 order by weekday',
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the working hours' });
  }
});

router.put('/me', auth, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Only cleaners can do this' });
  }

  const { name, bio, hourlyRate, avatarUrl } = req.body;
  try {
    const result = await pool.query(
      `update users set name = $1, bio = $2, hourly_rate = $3, avatar_url = $4
       where id = $5
       returning id, name, bio, hourly_rate, avatar_url`,
      [name, bio, hourlyRate, avatarUrl, req.user.id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the profile' });
  }
});

router.get('/me/services', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'select id, category, title, description, price_from from services where provider_id = $1 order by id',
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load your services' });
  }
});

router.post('/me/services', auth, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Only cleaners can do this' });
  }

  const { category, title, description, priceFrom } = req.body;
  if (!category || !title || !priceFrom) {
    return res.status(400).json({ error: 'Please fill in the type, title and price' });
  }

  try {
    const result = await pool.query(
      `insert into services (provider_id, category, title, description, price_from)
       values ($1, $2, $3, $4, $5)
       returning id, category, title, description, price_from`,
      [req.user.id, category, title, description, priceFrom],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not add the service' });
  }
});

router.put('/me/services/:serviceId', auth, async (req, res) => {
  const { category, title, description, priceFrom } = req.body;
  if (!category || !title || !priceFrom) {
    return res.status(400).json({ error: 'Please fill in the type, title and price' });
  }

  try {
    const result = await pool.query(
      `update services set category = $1, title = $2, description = $3, price_from = $4
       where id = $5 and provider_id = $6
       returning id, category, title, description, price_from`,
      [category, title, description, priceFrom, req.params.serviceId, req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the service' });
  }
});

router.delete('/me/services/:serviceId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'delete from services where id = $1 and provider_id = $2 returning id',
      [req.params.serviceId, req.user.id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ id: result.rows[0].id });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'This service has bookings and cannot be deleted' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not delete the service' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await pool.query(
      `select id, name, avatar_url, bio, hourly_rate from users
       where id = $1 and role = 'provider'`,
      [req.params.id],
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Cleaner not found' });
    }

    const services = await pool.query(
      'select id, category, title, description, price_from from services where provider_id = $1',
      [req.params.id],
    );

    const reviews = await pool.query(
      `select r.rating, r.comment, r.created_at, u.name as customer_name
       from reviews r
       join bookings b on b.id = r.booking_id
       join users u on u.id = b.customer_id
       where b.provider_id = $1
       order by r.created_at desc`,
      [req.params.id],
    );

    let rating = null;
    if (reviews.rows.length > 0) {
      let total = 0;
      for (const review of reviews.rows) {
        total += review.rating;
      }
      rating = (total / reviews.rows.length).toFixed(1);
    }

    res.json({
      ...user.rows[0],
      services: services.rows,
      reviews: reviews.rows,
      rating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the profile' });
  }
});

router.get('/:id/slots', async (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'The date is missing' });
  }

  try {
    const weekday = new Date(date).getDay();
    const now = new Date();
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const workingHours = await pool.query(
      'select start_time, end_time from availability where provider_id = $1 and weekday = $2',
      [req.params.id, weekday],
    );

    const booked = await pool.query(
      `select start_time, end_time from bookings
       where provider_id = $1 and booking_date = $2
       and status in ('pending', 'confirmed')`,
      [req.params.id, date],
    );

    const slots = [];
    for (const row of workingHours.rows) {
      let hour = parseInt(row.start_time.slice(0, 2));
      const lastHour = parseInt(row.end_time.slice(0, 2));

      while (hour + SLOT_LENGTH <= lastHour) {
        const start = pad(hour) + ':00:00';
        const end = pad(hour + SLOT_LENGTH) + ':00:00';
        const taken = booked.rows.some(
          booking => start < booking.end_time && end > booking.start_time,
        );

        const past = date === today && hour <= now.getHours();

        if (!taken && !past) {
          slots.push({ start_time: start.slice(0, 5), end_time: end.slice(0, 5) });
        }
        hour += SLOT_LENGTH;
      }
    }

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the free times' });
  }
});

module.exports = router;
