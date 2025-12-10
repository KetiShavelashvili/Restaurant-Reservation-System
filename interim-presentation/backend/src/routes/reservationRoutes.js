const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// GET all reservations
router.get('/', reservationController.getAllReservations);

// GET reservations by date
router.get('/date/:date', reservationController.getReservationsByDate);

// GET single reservation
router.get('/:id', reservationController.getReservationById);

// CREATE new reservation
router.post('/', reservationController.createReservation);

// UPDATE reservation
router.put('/:id', reservationController.updateReservation);

// DELETE reservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;