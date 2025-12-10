const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const reservationRoutes = require('./src/routes/reservationRoutes');
const tableRoutes = require('./src/routes/tableRoutes');

// Use routes
app.use('/api/reservations', reservationRoutes);
app.use('/api/tables', tableRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Reservation API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});