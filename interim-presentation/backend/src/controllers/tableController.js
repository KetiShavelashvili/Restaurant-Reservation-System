const { v4: uuidv4 } = require('uuid');
const { tables } = require('../models/reservationModel');

// GET all tables
exports.getAllTables = (req, res) => {
  res.json(tables);
};

// GET available tables
exports.getAvailableTables = (req, res) => {
  const availableTables = tables.filter(table => table.isAvailable);
  console.log('Available tables:', availableTables);
  res.json(availableTables);
};

// CREATE new table
exports.createTable = (req, res) => {
  const { tableNumber, capacity, location, features } = req.body;

  if (!tableNumber || !capacity || !location) {
    return res.status(400).json({ error: 'Table number, capacity, and location are required' });
  }

  const newTable = {
    id: uuidv4(),
    tableNumber,
    capacity: parseInt(capacity),
    location,
    isAvailable: true,
    features: features || []
  };

  tables.push(newTable);
  res.status(201).json(newTable);
};

// UPDATE table availability
exports.updateTableAvailability = (req, res) => {
  const table = tables.find(t => t.id === req.params.id);
  if (!table) {
    return res.status(404).json({ error: 'Table not found' });
  }

  const { isAvailable } = req.body;
  table.isAvailable = isAvailable;
  res.json(table);
};