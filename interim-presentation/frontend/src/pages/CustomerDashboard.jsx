import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaCalendarAlt, FaClock, FaUsers, FaEdit, 
  FaTimes, FaCheck, FaInfoCircle, FaHistory
} from 'react-icons/fa';
import './CustomerDashboard.css';

const API_URL = 'http://localhost:5000/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    partySize: 2,
    notes: ''
  });

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const fetchMyReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      
      // Filter reservations by user email
      const myReservations = data.filter(r => r.customerEmail === user.email);
      setReservations(myReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation.id);
    setEditForm({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize,
      notes: reservation.notes || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/reservations/${editingReservation}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchMyReservations();
        setEditingReservation(null);
        alert('Reservation updated successfully!');
      } else {
        alert('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Error updating reservation');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        await fetchMyReservations();
        alert('Reservation cancelled successfully!');
      } else {
        alert('Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Error cancelling reservation');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#3498db';
      default: return '#7f8c8d';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaClock />;
      case 'confirmed': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      case 'completed': return <FaHistory />;
      default: return <FaInfoCircle />;
    }
  };

  const upcomingReservations = reservations.filter(r => 
    r.status !== 'cancelled' && r.status !== 'completed' &&
    new Date(r.date) >= new Date()
  );

  const pastReservations = reservations.filter(r => 
    r.status === 'completed' || 
    r.status === 'cancelled' ||
    new Date(r.date) < new Date()
  );

  if (loading) {
    return <div className="loading-container">Loading your reservations...</div>;
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>My Reservations</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3498db' }}>
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>{reservations.length}</h3>
            <p>Total Reservations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#27ae60' }}>
            <FaCheck />
          </div>
          <div className="stat-info">
            <h3>{upcomingReservations.length}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f39c12' }}>
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="reservations-section">
        <h2>Upcoming Reservations</h2>
        {upcomingReservations.length === 0 ? (
          <div className="no-reservations">
            <p>You have no upcoming reservations</p>
            <a href="/reserve" className="btn-primary">Make a Reservation</a>
          </div>
        ) : (
          <div className="reservations-grid">
            {upcomingReservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                {editingReservation === reservation.id ? (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <h3>Edit Reservation</h3>
                    
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={editForm.customerName}
                        onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editForm.customerEmail}
                        onChange={(e) => setEditForm({...editForm, customerEmail: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={editForm.customerPhone}
                        onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Time</label>
                        <input
                          type="time"
                          value={editForm.time}
                          onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Party Size</label>
                      <select
                        value={editForm.partySize}
                        onChange={(e) => setEditForm({...editForm, partySize: parseInt(e.target.value)})}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Special Requests</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                        placeholder="Any special requests or dietary restrictions?"
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-save">
                        <FaCheck /> Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => setEditingReservation(null)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="reservation-header">
                      <div className="reservation-status">
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(reservation.status),
                            color: 'white'
                          }}
                        >
                          {getStatusIcon(reservation.status)}
                          <span>{reservation.status}</span>
                        </span>
                      </div>
                      <span className="table-badge">Table {reservation.tableNumber}</span>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        <div>
                          <label>Date</label>
                          <p>{reservation.date}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaClock className="detail-icon" />
                        <div>
                          <label>Time</label>
                          <p>{reservation.time}</p>
                        </div>
                      </div>

                      <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <div>
                          <label>Party Size</label>
                          <p>{reservation.partySize} people</p>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="detail-item full-width">
                          <FaInfoCircle className="detail-icon" />
                          <div>
                            <label>Special Requests</label>
                            <p>{reservation.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="reservation-actions">
                      {reservation.status !== 'confirmed' && (
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditClick(reservation)}
                        >
                          <FaEdit /> Edit
                        </button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <div className="confirmed-notice">
                          <FaInfoCircle /> Contact restaurant to modify confirmed reservations
                        </div>
                      )}
                      <button 
                        className="btn-delete"
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Reservations */}
      {pastReservations.length > 0 && (
        <div className="reservations-section">
          <h2>Past Reservations</h2>
          <div className="past-reservations-list">
            {pastReservations.map(reservation => (
              <div key={reservation.id} className="past-reservation-item">
                <div className="past-info">
                  <div className="past-date">
                    <FaCalendarAlt />
                    <span>{reservation.date} at {reservation.time}</span>
                  </div>
                  <div className="past-details">
                    <span className="party-size">
                      <FaUsers /> {reservation.partySize} people
                    </span>
                    <span className="table-number">Table {reservation.tableNumber}</span>
                  </div>
                </div>
                <span 
                  className="status-badge-small"
                  style={{ backgroundColor: getStatusColor(reservation.status) }}
                >
                  {reservation.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;