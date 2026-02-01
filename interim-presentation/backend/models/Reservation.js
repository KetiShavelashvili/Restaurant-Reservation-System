const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Please add customer name"],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, "Please add customer email"],
    lowercase: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, "Please add customer phone"],
    trim: true
  },
  date: {
    type: Date,
    required: [true, "Please add reservation date"]
  },
  time: {
    type: String,
    required: [true, "Please add reservation time"],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Please use HH:MM format"]
  },
  partySize: {
    type: Number,
    required: [true, "Please add party size"],
    min: [1, "Party size must be at least 1"],
    max: [20, "Party size cannot exceed 20"]
  },
  tableId: {
    type: String,
    required: [true, "Please select a table"]
  },
  tableNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
    default: "pending"
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Notes cannot exceed 500 characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// SIMPLE VERSION - Remove the buggy pre-save hook
// We'll handle updatedAt manually

module.exports = mongoose.model("Reservation", reservationSchema);
