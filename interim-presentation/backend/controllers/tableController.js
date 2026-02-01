const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort('tableNumber');
    res.json(tables);
  } catch (error) {
    console.error('Get all tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get available tables
// @route   GET /api/tables/available
// @access  Public
exports.getAvailableTables = async (req, res) => {
  try {
    const tables = await Table.find({ isAvailable: true }).sort('tableNumber');
    res.json(tables);
  } catch (error) {
    console.error('Get available tables error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create table (admin only)
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      table
    });
  } catch (error) {
    console.error('Create table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Table updated successfully',
      table
    });
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }
    
    await table.deleteOne();
    
    res.json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
