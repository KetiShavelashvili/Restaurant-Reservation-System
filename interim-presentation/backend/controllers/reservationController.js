const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
exports.getAllReservations = async (req, res) => {
  try {
    let query = {};
    
    // If user is customer, filter by their email
    if (req.user.role === 'customer') {
      query.customerEmail = req.user.email;
    }
    
    const reservations = await Reservation.find(query)
      .sort({ date: 1, time: 1 });
    
    res.json(reservations);
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if customer is trying to access someone else's reservation
    if (req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, date, time, partySize, tableId, notes } = req.body;

    // Create reservation
    const reservation = await Reservation.create({
      customerName,
      customerEmail,
      customerPhone,
      date: new Date(date),
      time,
      partySize,
      tableId,
      tableNumber: `Table-${tableId}`,
      status: req.user.role === 'staff' || req.user.role === 'admin' ? 'confirmed' : 'pending',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if customer is trying to update someone else's reservation
    if (req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Update fields
    const updateData = { ...req.body, updatedAt: new Date() };
    
    // Only admin/staff can update status
    if (req.body.status && req.user.role === 'customer') {
      delete updateData.status;
    }
    
    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      reservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }
    
    // Check if customer is trying to delete someone else's reservation
    if (req.user.role === 'customer' && reservation.customerEmail !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await reservation.deleteOne();
    
    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
