const express = require('express');
const router = express.Router();

// Mock tables data
const mockTables = [
  {
    id: '1',
    tableNumber: 'A1',
    capacity: 4,
    location: 'Window',
    isAvailable: false,
    features: ['window', 'quiet']
  },
  {
    id: '2',
    tableNumber: 'A2',
    capacity: 2,
    location: 'Main Hall',
    isAvailable: false,
    features: ['central']
  },
  {
    id: '3',
    tableNumber: 'B1',
    capacity: 6,
    location: 'Private Room',
    isAvailable: true,
    features: ['private', 'quiet']
  },
  {
    id: '4',
    tableNumber: 'B2',
    capacity: 4,
    location: 'Main Hall',
    isAvailable: true,
    features: []
  },
  {
    id: '5',
    tableNumber: 'C1',
    capacity: 8,
    location: 'Private Room',
    isAvailable: true,
    features: ['private', 'VIP']
  }
];

// GET all tables
router.get('/', (req, res) => {
  res.json(mockTables);
});

// GET available tables
router.get('/available', (req, res) => {
  const availableTables = mockTables.filter(table => table.isAvailable);
  res.json(availableTables);
});

module.exports = router;
