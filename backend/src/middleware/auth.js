const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'You are not logged in' });
  }

  try {
    req.user = jwt.verify(header.replace('Bearer ', ''), process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Your session is not valid anymore' });
  }
}

module.exports = auth;
