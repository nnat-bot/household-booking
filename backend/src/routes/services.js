const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, maxPrice } = req.query;

  let sql = `select s.id, s.category, s.title, s.description, s.price_from,
                    u.id as provider_id, u.name as provider_name, u.avatar_url, u.hourly_rate
             from services s
             join users u on u.id = s.provider_id
             where 1 = 1`;
  const values = [];

  if (category) {
    values.push(category);
    sql += ' and s.category = $' + values.length;
  }
  if (maxPrice) {
    values.push(maxPrice);
    sql += ' and s.price_from <= $' + values.length;
  }
  sql += ' order by s.price_from';

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the services' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'select category, min(price_from) as cheapest from services group by category order by category',
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load the categories' });
  }
});

module.exports = router;
