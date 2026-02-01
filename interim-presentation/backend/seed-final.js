require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

console.log("🌱 Starting SUPER SIMPLE database seeding...");

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/restaurant_reservation",
      {}
    );
    console.log("✅ Connected to MongoDB");
    
    // Get models (with simplified schemas)
    const User = mongoose.model("User", new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: Date
    }));
    
    const Table = mongoose.model("Table", new mongoose.Schema({
      tableNumber: String,
      capacity: Number,
      location: String,
      isAvailable: Boolean,
      features: [String],
      createdAt: Date
    }));
    
    const Reservation = mongoose.model("Reservation", new mongoose.Schema({
      customerName: String,
      customerEmail: String,
      customerPhone: String,
      date: Date,
      time: String,
      partySize: Number,
      tableId: String,
      tableNumber: String,
      status: String,
      notes: String,
      createdAt: Date,
      updatedAt: Date
    }));
    
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});
    
    // Create users
    console.log("👤 Creating users...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);
    
    await User.create([
      {
        name: "Admin User",
        email: "admin@restaurant.com",
        password: adminPassword,
        role: "admin",
        createdAt: new Date()
      },
      {
        name: "Staff Member",
        email: "staff@restaurant.com",
        password: staffPassword,
        role: "staff",
        createdAt: new Date()
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
        features: ["window", "quiet"],
        createdAt: new Date()
      },
      {
        tableNumber: "A2",
        capacity: 2,
        location: "main hall",
        isAvailable: false,
        features: ["quiet"],
        createdAt: new Date()
      },
      {
        tableNumber: "B1",
        capacity: 6,
        location: "private room",
        isAvailable: true,
        features: ["private", "quiet"],
        createdAt: new Date()
      },
      {
        tableNumber: "B2",
        capacity: 4,
        location: "main hall",
        isAvailable: true,
        features: [],
        createdAt: new Date()
      }
    ]);
    
    // Create reservations
    console.log("📅 Creating sample reservations...");
    const now = new Date();
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
        notes: "Window seat preferred",
        createdAt: now,
        updatedAt: now
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
        notes: "Anniversary celebration",
        createdAt: now,
        updatedAt: now
      }
    ]);
    
    console.log("\n🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("==================================");
    console.log("👥 LOGIN CREDENTIALS:");
    console.log("   Admin: admin@restaurant.com / admin123");
    console.log("   Staff: staff@restaurant.com / staff123");
    console.log("\n📊 DATA CREATED:");
    console.log("   Users: 2 (Admin + Staff)");
    console.log("   Tables: 4 (A1, A2, B1, B2)");
    console.log("   Reservations: 2 sample reservations");
    console.log("\n🔗 Test login at: http://localhost:5000/api/auth/login");
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error("❌ SEEDING ERROR:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Run it
seedData();

