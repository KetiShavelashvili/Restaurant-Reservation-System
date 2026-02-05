require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_reservation');

// Import models
const User = require('./models/User');
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@restaurant.com',
      password: adminPassword,
      role: 'admin'
    });
    
    // Create staff user
    console.log('👥 Creating staff user...');
    const staffPassword = await bcrypt.hash('staff123', 10);
    const staff = await User.create({
      name: 'Staff Member',
      email: 'staff@restaurant.com',
      password: staffPassword,
      role: 'staff'
    });
    
    // Create customer user
    console.log('👤 Creating customer user...');
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      name: 'John Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer'
    });
    
    // Create tables
    console.log('🪑 Creating tables...');
    const tables = [
      // Window tables 
      { tableNumber: 'W1', capacity: 2, location: 'window', features: ['window', 'quiet'], isAvailable: true },
      { tableNumber: 'W2', capacity: 2, location: 'window', features: ['window', 'quiet'], isAvailable: true },
      { tableNumber: 'W3', capacity: 4, location: 'window', features: ['window'], isAvailable: true },
      { tableNumber: 'W4', capacity: 2, location: 'window', features: ['window', 'quiet'], isAvailable: true },
      { tableNumber: 'W5', capacity: 4, location: 'window', features: ['window'], isAvailable: true },
      { tableNumber: 'W6', capacity: 2, location: 'window', features: ['window', 'quiet'], isAvailable: true },
      { tableNumber: 'W7', capacity: 4, location: 'window', features: ['window'], isAvailable: true },
      
      // Main hall tables 
      { tableNumber: 'M1', capacity: 4, location: 'main hall', features: ['central'], isAvailable: false },
      { tableNumber: 'M2', capacity: 4, location: 'main hall', features: [], isAvailable: false },
      { tableNumber: 'M3', capacity: 6, location: 'main hall', features: ['central'], isAvailable: true },
      
      // Private rooms
      { tableNumber: 'P1', capacity: 6, location: 'private room', features: ['private', 'quiet'], isAvailable: true },
      { tableNumber: 'P2', capacity: 8, location: 'private room', features: ['private', 'VIP'], isAvailable: true },
    ];
    
    for (const tableData of tables) {
      await Table.create(tableData);
    }
    
    // Create sample reservations
    console.log('📅 Creating sample reservations...');
    const reservations = [
      {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        date: new Date('2024-03-20'),
        time: '19:00',
        partySize: 4,
        tableId: '1',
        tableNumber: 'W1',
        status: 'confirmed',
        notes: 'Window seat preferred'
      },
      {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '987-654-3210',
        date: new Date('2024-03-21'),
        time: '18:30',
        partySize: 2,
        tableId: '2',
        tableNumber: 'M1',
        status: 'pending',
        notes: 'Anniversary celebration'
      }
    ];
    
    for (const reservationData of reservations) {
      await Reservation.create(reservationData);
    }
    
    console.log('✅ Database seeded successfully!');
    console.log('\n👥 Login Credentials:');
    console.log('   Admin: admin@restaurant.com / admin123');
    console.log('   Staff: staff@restaurant.com / staff123');
    console.log('   Customer: customer@example.com / customer123');
    console.log('\n🪑 Tables created:');
    console.log('   Window tables: 7');
    console.log('   Main hall tables: 3');
    console.log('   Private room tables: 2');
    console.log('   Total: 12 tables');
    console.log('\n📅 Reservations created: 2 sample reservations');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed
seedData();