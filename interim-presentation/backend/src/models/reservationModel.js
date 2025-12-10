// In-memory database
let reservations = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '123-456-7890',
    date: '2024-03-20',
    time: '19:00',
    partySize: 4,
    tableId: '1',
    tableNumber: 'A1',
    status: 'confirmed',
    notes: 'Window seat preferred',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '987-654-3210',
    date: '2024-03-21',
    time: '18:30',
    partySize: 2,
    tableId: '2',
    tableNumber: 'A2',
    status: 'pending',
    notes: 'Anniversary celebration',
    createdAt: '2024-03-16T14:20:00Z',
    updatedAt: '2024-03-16T14:20:00Z'
  }
];

let tables = [
  {
    id: '1',
    tableNumber: 'A1',
    capacity: 4,
    location: 'Window',
    isAvailable: false,
    features: ['window', 'quiet']
  },
  {
    id: '2',
    tableNumber: 'A2',
    capacity: 2,
    location: 'Main Hall',
    isAvailable: false,
    features: ['central']
  },
  {
    id: '3',
    tableNumber: 'B1',
    capacity: 6,
    location: 'Private Room',
    isAvailable: true,
    features: ['private', 'quiet']
  },
  {
    id: '4',
    tableNumber: 'B2',
    capacity: 4,
    location: 'Main Hall',
    isAvailable: true,
    features: []
  },
  {
    id: '5',
    tableNumber: 'C1',
    capacity: 8,
    location: 'Private Room',
    isAvailable: true,
    features: ['private', 'VIP']
  }
];

module.exports = { reservations, tables };