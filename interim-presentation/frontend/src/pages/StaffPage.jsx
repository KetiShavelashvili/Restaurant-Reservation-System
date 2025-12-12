import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaChartBar, FaUsers, FaCalendarAlt, 
  FaTrash, FaEdit, FaCheck, FaTimes, 
  FaFilter, FaSave, FaClock
} from 'react-icons/fa';
import './StaffPage.css';

const API_URL = 'http://localhost:5000/api';

const StaffPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingReservation, setEditingReservation] = useState(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    partySize: '',
    notes: '',
    status: ''
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setError(null);
      
      // Check if user and token exist
      if (!user || !user.token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.status === 401) {
        setError('Unauthorized. Please log in again.');
        setReservations([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setReservations(data);
      } else if (data.reservations && Array.isArray(data.reservations)) {
        setReservations(data.reservations);
      } else {
        setReservations([]);
        console.warn('Unexpected data format:', data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(`Failed to load reservations: ${error.message}`);
      setReservations([]);
      setLoading(false);
    }
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation.id);
    setEditForm({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize,
      notes: reservation.notes || '',
      status: reservation.status
    });
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setEditForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      partySize: '',
      notes: '',
      status: ''
    });
  };

  const handleSaveEdit = async (reservationId) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchReservations();
        setEditingReservation(null);
        alert('Reservation updated successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to update reservation: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation');
    }
  };

  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchReservations();
        alert(`Reservation ${newStatus} successfully!`);
      } else {
        alert('Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
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
        await fetchReservations();
        alert('Reservation deleted successfully!');
      } else {
        alert('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation');
    }
  };

  // Safely filter reservations
  const filteredReservations = Array.isArray(reservations)
    ? (filterStatus === 'all' 
        ? reservations 
        : reservations.filter(r => r.status === filterStatus))
    : [];

  // Safely calculate stats
  const stats = {
    totalReservations: Array.isArray(reservations) ? reservations.length : 0,
    todayReservations: Array.isArray(reservations) 
      ? reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length 
      : 0,
    pendingReservations: Array.isArray(reservations) 
      ? reservations.filter(r => r.status === 'pending').length 
      : 0,
    confirmedReservations: Array.isArray(reservations) 
      ? reservations.filter(r => r.status === 'confirmed').length 
      : 0,
    completedReservations: Array.isArray(reservations) 
      ? reservations.filter(r => r.status === 'completed').length 
      : 0,
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

  if (loading) {
    return (
      <div className="staff-page">
        <div className="loading-container">Loading staff panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-page">
        <div className="error-container" style={{
          padding: '40px',
          textAlign: 'center',
          color: '#e74c3c'
        }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchReservations}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h1>Staff Panel</h1>
        <p>Welcome, {user?.name || 'User'} - Manage reservations</p>
      </div>

      <div className="staff-container">
        <div className="staff-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar /> Overview
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <FaUsers /> Reservations
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveTab('today')}
            >
              <FaCalendarAlt /> Today's Schedule
            </button>
          </div>
        </div>

        <div className="staff-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#9b59b6' }}>
                    <FaUsers />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.totalReservations}</h3>
                    <p>Total Reservations</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e67e22' }}>
                    <FaCalendarAlt />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.todayReservations}</h3>
                    <p>Today's Reservations</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f39c12' }}>
                    <FaClock />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.pendingReservations}</h3>
                    <p>Pending</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#27ae60' }}>
                    <FaCheck />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.confirmedReservations}</h3>
                    <p>Confirmed</p>
                  </div>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>Reservation Status</h3>
                  <div className="status-chart">
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(status => {
                      const count = Array.isArray(reservations) 
                        ? reservations.filter(r => r.status === status).length 
                        : 0;
                      const percentage = reservations.length > 0 ? (count / reservations.length) * 100 : 0;
                      return (
                        <div key={status} className="status-item">
                          <div className="status-header">
                            <span className="status-label" style={{ color: getStatusColor(status) }}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            <span className="status-count">{count}</span>
                          </div>
                          <div className="status-bar">
                            <div 
                              className="status-fill" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: getStatusColor(status)
                              }}
                            ></div>
                          </div>
                          <span className="status-percentage">{percentage.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Recent Reservations</h3>
                  <div className="recent-reservations">
                    {reservations.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                        No reservations yet
                      </p>
                    ) : (
                      reservations.slice(0, 5).map(reservation => (
                        <div key={reservation.id} className="recent-item">
                          <div className="recent-info">
                            <strong>{reservation.customerName}</strong>
                            <span className="recent-date">{reservation.date} at {reservation.time}</span>
                          </div>
                          <span 
                            className="recent-status" 
                            style={{ color: getStatusColor(reservation.status) }}
                          >
                            {reservation.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="reservations-tab">
              <div className="section-header">
                <h2>All Reservations</h2>
                <div className="filter-controls">
                  <div className="filter-group">
                    <FaFilter />
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="status-filter"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="reservations-table-container">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Date & Time</th>
                      <th>Party Size</th>
                      <th>Table</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map(reservation => (
                      <React.Fragment key={reservation.id}>
                        {editingReservation === reservation.id ? (
                          <tr className="editing-row">
                            <td colSpan="7">
                              <div className="edit-reservation-form">
                                <h4>Edit Reservation</h4>
                                <div className="edit-form-grid">
                                  <div className="form-group">
                                    <label>Customer Name</label>
                                    <input
                                      type="text"
                                      value={editForm.customerName}
                                      onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Email</label>
                                    <input
                                      type="email"
                                      value={editForm.customerEmail}
                                      onChange={(e) => setEditForm({...editForm, customerEmail: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                      type="tel"
                                      value={editForm.customerPhone}
                                      onChange={(e) => setEditForm({...editForm, customerPhone: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Date</label>
                                    <input
                                      type="date"
                                      value={editForm.date}
                                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Time</label>
                                    <input
                                      type="time"
                                      value={editForm.time}
                                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Party Size</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="20"
                                      value={editForm.partySize}
                                      onChange={(e) => setEditForm({...editForm, partySize: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div className="form-group">
                                    <label>Status</label>
                                    <select
                                      value={editForm.status}
                                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="confirmed">Confirmed</option>
                                      <option value="cancelled">Cancelled</option>
                                      <option value="completed">Completed</option>
                                    </select>
                                  </div>
                                  
                                  <div className="form-group full-width">
                                    <label>Notes</label>
                                    <textarea
                                      value={editForm.notes}
                                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                      rows="3"
                                      placeholder="Special requests or notes..."
                                    />
                                  </div>
                                </div>
                                
                                <div className="edit-form-actions">
                                  <button 
                                    className="btn-save"
                                    onClick={() => handleSaveEdit(reservation.id)}
                                  >
                                    <FaSave /> Save Changes
                                  </button>
                                  <button 
                                    className="btn-cancel-edit"
                                    onClick={handleCancelEdit}
                                  >
                                    <FaTimes /> Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td>
                              <div className="customer-info">
                                <strong>{reservation.customerName}</strong>
                                {reservation.notes && (
                                  <small title={reservation.notes}>Note</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <div>{reservation.customerEmail}</div>
                                <div className="phone">{reservation.customerPhone}</div>
                              </div>
                            </td>
                            <td>
                              <div className="datetime-info">
                                <div className="date">{reservation.date}</div>
                                <div className="time">{reservation.time}</div>
                              </div>
                            </td>
                            <td>
                              <span className="party-size">{reservation.partySize} people</span>
                            </td>
                            <td>
                              <span className="table-number">Table {reservation.tableNumber}</span>
                            </td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(reservation.status) }}
                              >
                                {reservation.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button 
                                  className="btn-action edit"
                                  onClick={() => handleEditReservation(reservation)}
                                  title="Edit reservation"
                                >
                                  <FaEdit />
                                </button>
                                {reservation.status === 'pending' && (
                                  <button 
                                    className="btn-action confirm"
                                    onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                                    title="Confirm reservation"
                                  >
                                    <FaCheck />
                                  </button>
                                )}
                                {reservation.status === 'confirmed' && (
                                  <button 
                                    className="btn-action complete"
                                    onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                                    title="Mark as completed"
                                  >
                                    <FaCheck />
                                  </button>
                                )}
                                <button 
                                  className="btn-action delete"
                                  onClick={() => handleDeleteReservation(reservation.id)}
                                  title="Delete reservation"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                
                {filteredReservations.length === 0 && (
                  <div className="no-data">
                    <p>No reservations found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'today' && (
            <div className="today-tab">
              <h2>Today's Schedule</h2>
              <div className="today-date">
                <FaCalendarAlt />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div className="today-stats">
                <div className="today-stat">
                  <strong>{stats.todayReservations}</strong>
                  <span>Total Reservations</span>
                </div>
                <div className="today-stat">
                  <strong>{Array.isArray(reservations) ? reservations.filter(r => r.date === new Date().toISOString().split('T')[0] && r.status === 'confirmed').length : 0}</strong>
                  <span>Confirmed</span>
                </div>
                <div className="today-stat">
                  <strong>{Array.isArray(reservations) ? reservations.filter(r => r.date === new Date().toISOString().split('T')[0] && r.status === 'pending').length : 0}</strong>
                  <span>Pending</span>
                </div>
              </div>

              <div className="today-reservations">
                {Array.isArray(reservations) && reservations
                  .filter(r => r.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(reservation => (
                    <div key={reservation.id} className="today-reservation-card">
                      <div className="today-reservation-time">
                        <FaClock />
                        <strong>{reservation.time}</strong>
                      </div>
                      <div className="today-reservation-details">
                        <h4>{reservation.customerName}</h4>
                        <p>{reservation.partySize} people • Table {reservation.tableNumber}</p>
                        <p className="contact">{reservation.customerPhone}</p>
                        {reservation.notes && (
                          <p className="notes">{reservation.notes}</p>
                        )}
                      </div>
                      <div className="today-reservation-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {reservation.status}
                        </span>
                        <div className="today-actions">
                          {reservation.status === 'pending' && (
                            <button 
                              className="btn-quick-action confirm"
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                            >
                              Confirm
                            </button>
                          )}
                          {reservation.status === 'confirmed' && (
                            <button 
                              className="btn-quick-action complete"
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {(!Array.isArray(reservations) || reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length === 0) && (
                  <div className="no-data">
                    <p>No reservations for today</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;