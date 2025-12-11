import React, { useState } from 'react';
import { useReservation } from '../context/ReservationContext.jsx';
import './ReservationsList.css';

const ReservationsList = () => {
  const { reservations, loading } = useReservation();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading && reservations.length === 0) {
    return (
      <div className="reservations-list-page">
        <div className="loading">Loading reservations...</div>
      </div>
    );
  }

  const filteredReservations = reservations.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reservations-list-page">
      <h1>All Reservations</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search reservations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredReservations.length === 0 ? (
        <div className="no-reservations">
          <p>No reservations found.</p>
        </div>
      ) : (
        <div className="reservations-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Party Size</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.customerName}</td>
                  <td>{reservation.customerEmail}</td>
                  <td>{reservation.customerPhone}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.partySize}</td>
                  <td>{reservation.tableNumber}</td>
                  <td>
                    <span className={`status-badge ${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationsList;