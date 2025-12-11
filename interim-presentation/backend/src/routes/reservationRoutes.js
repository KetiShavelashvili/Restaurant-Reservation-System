const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// All authenticated users can create and view reservations
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);
router.get('/date/:date', reservationController.getReservationsByDate);
router.get('/:id', reservationController.getReservationById);

// All authenticated users can update/delete their own reservations
// Admin/staff can update/delete any reservation
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;