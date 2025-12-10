import React, { useState, useEffect } from 'react';
import { useReservation } from '../context/ReservationContext';
import { 
  FaSearch, FaFilter, FaEdit, FaTrash, 
  FaCheck, FaTimes, FaCalendarAlt, FaUser,
  FaPhone, FaEnvelope, FaUsers, FaTable,
  FaSort, FaSortUp, FaSortDown
} from 'react-icons/fa';
import './ReservationsList.css';

const ReservationsList = () => {
  const { reservations, deleteReservation, updateReservation, loading } = useReservation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Apply filters and sorting
  const filteredReservations = reservations
    .filter(reservation => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        reservation.customerName.toLowerCase().includes(searchLower) ||
        reservation.customerEmail.toLowerCase().includes(searchLower) ||
        reservation.customerPhone.toLowerCase().includes(searchLower) ||
        reservation.tableNumber.toLowerCase().includes(searchLower);
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting logic
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date sorting
      if (sortField === 'date') {
        aValue = new Date(a.date + ' ' + a.time);
        bValue = new Date(b.date + ' ' + b.time);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
    setEditData({ ...reservation });
  };

  const handleSave = async (id) => {
    try {
      await updateReservation(id, editData);
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Failed to update reservation:', error);
      alert('Failed to update reservation. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await deleteReservation(id);
      } catch (error) {
        console.error('Failed to delete reservation:', error);
        alert('Failed to delete reservation. Please try again.');
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'cancelled': return '❌';
      case 'completed': return '🎉';
      default: return '📝';
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

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="reservations-list-page loading">
        <div className="loading-spinner"></div>
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="reservations-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Reservation Management</h1>
          <p>View and manage all restaurant reservations</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <div className="stat-icon total">
              <FaCalendarAlt />
            </div>
            <div className="stat-info">
              <h3>{reservations.length}</h3>
              <p>Total Reservations</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon pending">
              <FaClock />
            </div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon confirmed">
              <FaCheck />
            </div>
            <div className="stat-info">
              <h3>{reservations.filter(r => r.status === 'confirmed').length}</h3>
              <p>Confirmed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
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
          
          <div className="sort-controls">
            <span className="sort-label">Sort by:</span>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortField === 'date' ? 'active' : ''}`}
                onClick={() => handleSort('date')}
              >
                Date {getSortIcon('date')}
              </button>
              <button 
                className={`sort-btn ${sortField === 'customerName' ? 'active' : ''}`}
                onClick={() => handleSort('customerName')}
              >
                Name {getSortIcon('customerName')}
              </button>
              <button 
                className={`sort-btn ${sortField === 'partySize' ? 'active' : ''}`}
                onClick={() => handleSort('partySize')}
              >
                Party Size {getSortIcon('partySize')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="reservations-container">
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No reservations found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="reservations-grid">
            {filteredReservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                {editingId === reservation.id ? (
                  // Edit Mode
                  <div className="edit-mode">
                    <div className="edit-header">
                      <h3>Edit Reservation</h3>
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleSave(reservation.id)}
                          className="btn-save"
                          title="Save"
                        >
                          <FaCheck /> Save
                        </button>
                        <button 
                          onClick={handleCancel}
                          className="btn-cancel"
                          title="Cancel"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                    
                    <div className="edit-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label><FaUser /> Name</label>
                          <input
                            type="text"
                            name="customerName"
                            value={editData.customerName || ''}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label><FaEnvelope /> Email</label>
                          <input
                            type="email"
                            name="customerEmail"
                            value={editData.customerEmail || ''}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label><FaPhone /> Phone</label>
                          <input
                            type="tel"
                            name="customerPhone"
                            value={editData.customerPhone || ''}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label><FaUsers /> Party Size</label>
                          <select
                            name="partySize"
                            value={editData.partySize || 2}
                            onChange={handleChange}
                            className="edit-input"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label><FaCalendarAlt /> Date</label>
                          <input
                            type="date"
                            name="date"
                            value={editData.date || ''}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Time</label>
                          <select
                            name="time"
                            value={editData.time || '19:00'}
                            onChange={handleChange}
                            className="edit-input"
                          >
                            {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Status</label>
                        <select
                          name="status"
                          value={editData.status || 'pending'}
                          onChange={handleChange}
                          className={`status-select ${editData.status}`}
                          style={{ borderColor: getStatusColor(editData.status || 'pending') }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="reservation-header">
                      <div className="customer-info">
                        <div className="customer-name">
                          <FaUser className="icon" />
                          <h3>{reservation.customerName}</h3>
                        </div>
                        <span 
                          className="reservation-status"
                          style={{ backgroundColor: getStatusColor(reservation.status) }}
                        >
                          {getStatusIcon(reservation.status)} {reservation.status}
                        </span>
                      </div>
                      <div className="reservation-id">
                        ID: {reservation.id.substring(0, 8)}...
                      </div>
                    </div>
                    
                    <div className="reservation-details">
                      <div className="detail-group">
                        <div className="detail-item">
                          <FaEnvelope className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{reservation.customerEmail}</span>
                          </div>
                        </div>
                        
                        <div className="detail-item">
                          <FaPhone className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{reservation.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="detail-group">
                        <div className="detail-item">
                          <FaCalendarAlt className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Date & Time</span>
                            <span className="detail-value">{reservation.date} at {reservation.time}</span>
                          </div>
                        </div>
                        
                        <div className="detail-item">
                          <FaUsers className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Party Size</span>
                            <span className="detail-value">{reservation.partySize} people</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="detail-group">
                        <div className="detail-item">
                          <FaTable className="detail-icon" />
                          <div className="detail-content">
                            <span className="detail-label">Table</span>
                            <span className="detail-value">Table {reservation.tableNumber}</span>
                          </div>
                        </div>
                        
                        <div className="detail-item">
                          <div className="detail-icon">📝</div>
                          <div className="detail-content">
                            <span className="detail-label">Notes</span>
                            <span className="detail-value">
                              {reservation.notes || 'No special requests'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="reservation-footer">
                      <div className="timestamp">
                        Created: {new Date(reservation.createdAt).toLocaleDateString()}
                      </div>
                      <div className="actions">
                        <button 
                          onClick={() => handleEdit(reservation)}
                          className="btn-edit"
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(reservation.id)}
                          className="btn-delete"
                          title="Delete"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Summary */}
        {filteredReservations.length > 0 && (
          <div className="summary-section">
            <div className="summary-card">
              <h4>Summary</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Total Displayed:</span>
                  <span className="stat-value">{filteredReservations.length}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Total Guests:</span>
                  <span className="stat-value">
                    {filteredReservations.reduce((sum, r) => sum + r.partySize, 0)}
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Average Party:</span>
                  <span className="stat-value">
                    {(filteredReservations.reduce((sum, r) => sum + r.partySize, 0) / filteredReservations.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsList;