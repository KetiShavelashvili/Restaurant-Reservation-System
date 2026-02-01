const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Please add a table number'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please add table capacity'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot exceed 20']
  },
  location: {
    type: String,
    required: [true, 'Please add table location'],
    enum: ['window', 'main hall', 'private room', 'terrace', 'bar'],
    default: 'main hall'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    enum: ['window', 'quiet', 'private', 'VIP', 'wheelchair accessible', 'outdoor']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Table', tableSchema);
