require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const providerRoutes = require('./routes/providers');
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/providers', providerRoutes);
app.use('/bookings', bookingRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Household booking API is running' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
