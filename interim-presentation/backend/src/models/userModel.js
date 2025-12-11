// Follow the same pattern as your reservationModel.js
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@restaurant.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Staff Member',
    email: 'staff@restaurant.com',
    password: 'staff123',
    role: 'staff'
  }
];

let sessions = {};

module.exports = { users, sessions };