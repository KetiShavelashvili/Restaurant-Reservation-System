const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  partySize: {
    type: Number,
    required: true,
    min: 1
  },
  tableNumber: {
    type: String,
    default: ''
  },
  tables: [{
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table'
    },
    tableNumber: String,
    capacity: Number
  }],
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', ReservationSchema);