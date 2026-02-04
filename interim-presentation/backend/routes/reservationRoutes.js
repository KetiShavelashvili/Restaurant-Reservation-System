const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// GET reservations by date (specific route first)
router.get('/date/:date', async (req, res) => {
  try {
    const reservations = await require('../models/Reservation').find({ 
      date: req.params.date,
      status: { $ne: 'cancelled' }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Main CRUD routes
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.post('/', reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

// IMPORTANT: Export the router!
module.exports = router;