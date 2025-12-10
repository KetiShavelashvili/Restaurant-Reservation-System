const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// GET all tables
router.get('/', tableController.getAllTables);

// GET available tables
router.get('/available', tableController.getAvailableTables);

// CREATE new table
router.post('/', tableController.createTable);

// UPDATE table availability
router.put('/:id/availability', tableController.updateTableAvailability);

module.exports = router;