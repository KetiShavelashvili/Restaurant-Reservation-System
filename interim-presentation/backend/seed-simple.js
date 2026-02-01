require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

console.log("🌱 Starting SIMPLE database seeding...");

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant_reservation"
    );
    console.log("✅ Connected to MongoDB");
    
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    
    // Get models
    const User = require("./models/User");
    const Table = require("./models/Table");
    const Reservation = require("./models/Reservation");
    
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    
    // Create users with MANUALLY HASHED passwords
    console.log("👤 Creating users...");
    
    // Hash passwords BEFORE creating users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);
    const customerPassword = await bcrypt.hash("customer123", 10);
    
    await User.create([
      {
        name: "Admin User",
        email: "admin@restaurant.com",
        password: adminPassword,
        role: "admin"
      },
      {
        name: "Staff Member",
        email: "staff@restaurant.com",
        password: staffPassword,
        role: "staff"
      },
      {
        name: "John Doe",
        email: "customer@example.com",
        password: customerPassword,
        role: "customer"
      }
    ]);
    
    // Create tables
    console.log("🪑 Creating tables...");
    await Table.create([
      {
        tableNumber: "A1",
        capacity: 4,
        location: "window",
        isAvailable: false,
        features: ["window", "quiet"]
      },
      {
        tableNumber: "A2",
        capacity: 2,
        location: "main hall",
        isAvailable: false,
        features: ["central"]
      },
      {
        tableNumber: "B1",
        capacity: 6,
        location: "private room",
        isAvailable: true,
        features: ["private", "quiet"]
      },
      {
        tableNumber: "B2",
        capacity: 4,
        location: "main hall",
        isAvailable: true,
        features: []
      },
      {
        tableNumber: "C1",
        capacity: 8,
        location: "private room",
        isAvailable: true,
        features: ["private", "VIP"]
      }
    ]);
    
    // Create reservations
    console.log("📅 Creating sample reservations...");
    await Reservation.create([
      {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "123-456-7890",
        date: new Date("2024-03-20"),
        time: "19:00",
        partySize: 4,
        tableId: "1",
        tableNumber: "A1",
        status: "confirmed",
        notes: "Window seat preferred"
      },
      {
        customerName: "Jane Smith",
        customerEmail: "jane@example.com",
        customerPhone: "987-654-3210",
        date: new Date("2024-03-21"),
        time: "18:30",
        partySize: 2,
        tableId: "2",
        tableNumber: "A2",
        status: "pending",
        notes: "Anniversary celebration"
      }
    ]);
    
    console.log("✅ Database seeded successfully!");
    console.log("\n👥 Login Credentials:");
    console.log("   Admin: admin@restaurant.com / admin123");
    console.log("   Staff: staff@restaurant.com / staff123");
    console.log("   Customer: customer@example.com / customer123");
    console.log("\n🪑 Tables created: 5 tables");
    console.log("📅 Reservations created: 2 sample reservations");
    
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
}

// Run the seed
seedData();
