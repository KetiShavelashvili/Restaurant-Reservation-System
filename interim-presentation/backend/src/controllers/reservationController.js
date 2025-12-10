const { v4: uuidv4 } = require('uuid');
const { reservations, tables } = require('../models/reservationModel');

// GET all reservations
exports.getAllReservations = (req, res) => {
  res.json(reservations);
};

// GET reservation by date
exports.getReservationsByDate = (req, res) => {
  const { date } = req.params;
  const reservationsByDate = reservations.filter(r => r.date === date);
  res.json(reservationsByDate);
};

// GET single reservation
exports.getReservationById = (req, res) => {
  const reservation = reservations.find(r => r.id === req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  res.json(reservation);
};

// CREATE new reservation
exports.createReservation = (req, res) => {
  const { customerName, customerEmail, customerPhone, date, time, partySize, notes } = req.body;

  // Validation
  if (!customerName || !customerEmail || !customerPhone || !date || !time || !partySize) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Find available table
  const availableTable = tables.find(table => 
    table.capacity >= partySize && 
    table.isAvailable === true
  );

  if (!availableTable) {
    return res.status(400).json({ error: 'No tables available for this party size' });
  }

  const newReservation = {
    id: uuidv4(),
    customerName,
    customerEmail,
    customerPhone,
    date,
    time,
    partySize: parseInt(partySize),
    tableId: availableTable.id,
    tableNumber: availableTable.tableNumber,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Update table availability
  availableTable.isAvailable = false;

  reservations.push(newReservation);
  res.status(201).json(newReservation);
};

// UPDATE reservation
exports.updateReservation = (req, res) => {
  const index = reservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const { customerName, customerEmail, customerPhone, date, time, partySize, status, notes } = req.body;
  
  // Update fields
  if (customerName) reservations[index].customerName = customerName;
  if (customerEmail) reservations[index].customerEmail = customerEmail;
  if (customerPhone) reservations[index].customerPhone = customerPhone;
  if (date) reservations[index].date = date;
  if (time) reservations[index].time = time;
  if (partySize) reservations[index].partySize = parseInt(partySize);
  if (status) reservations[index].status = status;
  if (notes !== undefined) reservations[index].notes = notes;
  
  reservations[index].updatedAt = new Date().toISOString();

  res.json(reservations[index]);
};

// DELETE reservation
exports.deleteReservation = (req, res) => {
  const index = reservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const reservation = reservations[index];
  
  // Free up the table
  const table = tables.find(t => t.id === reservation.tableId);
  if (table) {
    table.isAvailable = true;
  }

  reservations.splice(index, 1);
  res.json({ message: 'Reservation deleted successfully' });
};