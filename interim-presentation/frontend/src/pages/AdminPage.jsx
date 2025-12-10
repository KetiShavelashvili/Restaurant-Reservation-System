import React, { useState } from 'react';
import { useReservation } from '../context/ReservationContext';
import { tableAPI } from '../services/api';
import { 
  FaPlus, FaChartBar, FaTable, FaUsers, 
  FaCalendarAlt, FaCog, FaTrash, FaEdit,
  FaCheck, FaTimes, FaFilter
} from 'react-icons/fa';
import './AdminPage.css';

const AdminPage = () => {
  const { tables, reservations, loadTables } = useReservation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showTableForm, setShowTableForm] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: 4,
    location: 'Main Hall',
    features: []
  });
  const [featureInput, setFeatureInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      await tableAPI.createTable(newTable);
      await loadTables();
      setNewTable({
        tableNumber: '',
        capacity: 4,
        location: 'Main Hall',
        features: []
      });
      setShowTableForm(false);
      alert('✅ Table created successfully!');
    } catch (err) {
      alert('❌ Failed to create table');
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setNewTable({
        ...newTable,
        features: [...newTable.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setNewTable({
      ...newTable,
      features: newTable.features.filter((_, i) => i !== index)
    });
  };

  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  const stats = {
    totalTables: tables.length,
    availableTables: tables.filter(t => t.isAvailable).length,
    totalReservations: reservations.length,
    todayReservations: reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    confirmedReservations: reservations.filter(r => r.status === 'confirmed').length,
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

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage restaurant tables and reservations</p>
      </div>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartBar /> Overview
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'tables' ? 'active' : ''}`}
              onClick={() => setActiveTab('tables')}
            >
              <FaTable /> Tables
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'reservations' ? 'active' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <FaUsers /> Reservations
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <FaCalendarAlt /> Calendar
            </button>
            <button 
              className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FaCog /> Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#3498db' }}>
                    <FaTable />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.totalTables}</h3>
                    <p>Total Tables</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#27ae60' }}>
                    <FaCheck />
                  </div>
                  <div className="stat-info">
                    <h3>{stats.availableTables}</h3>
                    <p>Available Tables</p>
                  </div>
                </div>
                
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
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>Reservation Status</h3>
                  <div className="status-chart">
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(status => {
                      const count = reservations.filter(r => r.status === status).length;
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
                    {reservations.slice(0, 5).map(reservation => (
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="tables-tab">
              <div className="section-header">
                <h2>Table Management</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowTableForm(!showTableForm)}
                >
                  <FaPlus /> Add New Table
                </button>
              </div>

              {showTableForm && (
                <div className="table-form-card">
                  <h3>Add New Table</h3>
                  <form onSubmit={handleCreateTable}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Table Number</label>
                        <input
                          type="text"
                          value={newTable.tableNumber}
                          onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                          required
                          placeholder="e.g., A1, B2"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Capacity</label>
                        <select
                          value={newTable.capacity}
                          onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                        >
                          {[2, 4, 6, 8, 10, 12].map(num => (
                            <option key={num} value={num}>{num} people</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <select
                          value={newTable.location}
                          onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                        >
                          <option value="Main Hall">Main Hall</option>
                          <option value="Window">Window</option>
                          <option value="Private Room">Private Room</option>
                          <option value="Patio">Patio</option>
                          <option value="Bar">Bar</option>
                          <option value="Garden">Garden</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Features</label>
                      <div className="features-input-group">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="Add a feature (e.g., window, quiet, VIP)"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <button type="button" onClick={addFeature} className="btn-add-feature">
                          Add
                        </button>
                      </div>
                      <div className="features-tags">
                        {newTable.features.map((feature, index) => (
                          <span key={index} className="feature-tag">
                            {feature}
                            <button type="button" onClick={() => removeFeature(index)} className="remove-feature">
                              <FaTimes />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        Create Table
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={() => setShowTableForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="tables-grid">
                {tables.map(table => (
                  <div key={table.id} className="table-card">
                    <div className="table-header">
                      <h3>Table {table.tableNumber}</h3>
                      <span className={`table-status ${table.isAvailable ? 'available' : 'booked'}`}>
                        {table.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <div className="table-details">
                      <div className="detail">
                        <span className="label">Capacity:</span>
                        <span className="value">{table.capacity} people</span>
                      </div>
                      <div className="detail">
                        <span className="label">Location:</span>
                        <span className="value">{table.location}</span>
                      </div>
                      {table.features.length > 0 && (
                        <div className="detail">
                          <span className="label">Features:</span>
                          <div className="features">
                            {table.features.map((feature, idx) => (
                              <span key={idx} className="feature-badge">{feature}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="table-actions">
                      <button className="btn-edit">
                        <FaEdit /> Edit
                      </button>
                      <button className="btn-delete">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
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
                <table className="admin-table">
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
                      <tr key={reservation.id}>
                        <td>
                          <div className="customer-info">
                            <strong>{reservation.customerName}</strong>
                            {reservation.notes && (
                              <small title={reservation.notes}>📝 Note</small>
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
                            <button className="btn-action edit">
                              <FaEdit />
                            </button>
                            <button className="btn-action delete">
                              <FaTrash />
                            </button>
                            <button className="btn-action confirm">
                              <FaCheck />
                            </button>
                          </div>
                        </td>
                      </tr>
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

          {activeTab === 'calendar' && (
            <div className="calendar-tab">
              <h2>Reservation Calendar</h2>
              <div className="calendar-placeholder">
                <div className="calendar-info">
                  <FaCalendarAlt className="calendar-icon" />
                  <h3>Calendar View</h3>
                  <p>View and manage reservations by date</p>
                  <div className="calendar-stats">
                    <div className="calendar-stat">
                      <strong>{reservations.length}</strong>
                      <span>Total Reservations</span>
                    </div>
                    <div className="calendar-stat">
                      <strong>{new Set(reservations.map(r => r.date)).size}</strong>
                      <span>Days with Reservations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h2>Restaurant Settings</h2>
              <div className="settings-grid">
                <div className="setting-card">
                  <h3>Business Hours</h3>
                  <div className="setting-content">
                    <p>Configure your restaurant's operating hours</p>
                    <button className="btn-setting">Configure</button>
                  </div>
                </div>
                
                <div className="setting-card">
                  <h3>Reservation Rules</h3>
                  <div className="setting-content">
                    <p>Set maximum party size, lead time, etc.</p>
                    <button className="btn-setting">Configure</button>
                  </div>
                </div>
                
                <div className="setting-card">
                  <h3>Notification Settings</h3>
                  <div className="setting-content">
                    <p>Configure email and SMS notifications</p>
                    <button className="btn-setting">Configure</button>
                  </div>
                </div>
                
                <div className="setting-card">
                  <h3>Table Layout</h3>
                  <div className="setting-content">
                    <p>Manage table arrangement and sections</p>
                    <button className="btn-setting">Configure</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;