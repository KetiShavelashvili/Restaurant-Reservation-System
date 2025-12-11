const { v4: uuidv4 } = require('uuid');
const { reservations, tables } = require('../models/reservationModel');

// GET all reservations (admin/staff see all, customers see only their own)
exports.getAllReservations = (req, res) => {
  // If user is customer, filter by their email
  if (req.user && req.user.role === 'customer') {
    const userReservations = reservations.filter(r => r.customerEmail === req.user.email);
    return res.json(userReservations);
  }
  
  // Admin and staff see all reservations
  res.json(reservations);
};

// GET reservation by date
exports.getReservationsByDate = (req, res) => {
  const { date } = req.params;
  let reservationsByDate = reservations.filter(r => r.date === date);
  
  // If user is customer, filter by their email
  if (req.user && req.user.role === 'customer') {
    reservationsByDate = reservationsByDate.filter(r => r.customerEmail === req.user.email);
  }
  
  res.json(reservationsByDate);
};

// GET single reservation
exports.getReservationById = (req, res) => {
  const reservation = reservations.find(r => r.id === req.params.id);
  
  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  
  // Check if customer is trying to access someone else's reservation
  if (req.user && req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.json(reservation);
};

// CREATE new reservation
exports.createReservation = (req, res) => {
  const { customerName, customerEmail, customerPhone, date, time, partySize, tableId, notes } = req.body;

  // Validation
  if (!customerName || !customerEmail || !customerPhone || !date || !time || !partySize || !tableId) {
    return res.status(400).json({ error: 'All fields are required, including table selection' });
  }

  // Find the selected table
  const selectedTable = tables.find(table => table.id === tableId);

  if (!selectedTable) {
    return res.status(400).json({ error: 'Selected table not found' });
  }

  if (!selectedTable.isAvailable) {
    return res.status(400).json({ error: 'Selected table is no longer available' });
  }

  if (selectedTable.capacity < partySize) {
    return res.status(400).json({ error: 'Selected table is too small for your party size' });
  }

  const newReservation = {
    id: uuidv4(),
    customerName,
    customerEmail,
    customerPhone,
    date,
    time,
    partySize: parseInt(partySize),
    tableId: selectedTable.id,
    tableNumber: selectedTable.tableNumber,
    status: 'pending',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Update table availability
  selectedTable.isAvailable = false;

  reservations.push(newReservation);
  res.status(201).json(newReservation);
};

// UPDATE reservation
exports.updateReservation = (req, res) => {
  const index = reservations.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  const reservation = reservations[index];
  
  // Check if customer is trying to update someone else's reservation
  if (req.user && req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Customers cannot update confirmed reservations
  if (req.user && req.user.role === 'customer' && reservation.status === 'confirmed') {
    return res.status(403).json({ error: 'Cannot modify confirmed reservations. Please contact the restaurant.' });
  }

  const { customerName, customerEmail, customerPhone, date, time, partySize, status, notes } = req.body;
  
  // Update fields
  if (customerName) reservations[index].customerName = customerName;
  if (customerEmail) reservations[index].customerEmail = customerEmail;
  if (customerPhone) reservations[index].customerPhone = customerPhone;
  if (date) reservations[index].date = date;
  if (time) reservations[index].time = time;
  if (partySize) reservations[index].partySize = parseInt(partySize);
  
  // Only admin/staff can update status
  if (status && req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    reservations[index].status = status;
  }
  
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
  
  // Check if customer is trying to delete someone else's reservation
  if (req.user && req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Free up the table
  const table = tables.find(t => t.id === reservation.tableId);
  if (table) {
    table.isAvailable = true;
  }

  reservations.splice(index, 1);
  res.json({ message: 'Reservation deleted successfully' });
};