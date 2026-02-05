const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_reservation'
    );
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️ Server will continue without database connection.');
    return null;
  }
};

module.exports = connectDB;