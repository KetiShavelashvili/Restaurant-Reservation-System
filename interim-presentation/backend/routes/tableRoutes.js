const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
});

module.exports = router;
