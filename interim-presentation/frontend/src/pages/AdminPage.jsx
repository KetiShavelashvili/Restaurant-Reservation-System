import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaChartBar, FaTable, FaUsers, 
  FaCalendarAlt, FaCog, FaTrash, FaEdit,
  FaCheck, FaTimes, FaFilter, FaSave
} from 'react-icons/fa';
import './AdminPage.css';

const API_URL = 'http://localhost:5000/api';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: 4,
    location: 'main hall',
    features: [],
    isAvailable: true
  });
  const [featureInput, setFeatureInput] = useState('');
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
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchTables(), fetchReservations()]);
    setLoading(false);
  };

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/tables`);
      const data = await response.json();
      console.log('Fetched tables:', data);
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched reservations:', data);
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating table:', newTable);
      
      const response = await fetch(`${API_URL}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newTable)
      });

      const data = await response.json();
      console.log('Create response:', data);

      if (response.ok) {
        await fetchTables();
        setNewTable({
          tableNumber: '',
          capacity: 4,
          location: 'main hall',
          features: [],
          isAvailable: true
        });
        setShowTableForm(false);
        alert('Table created successfully!');
      } else {
        console.error('Create failed:', data);
        alert(`Failed to create table: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating table:', err);
      alert(`Failed to create table: ${err.message}`);
    }
  };

  const handleEditTable = (table) => {
    // Get the correct ID
    const tableId = table._id || table.id;
    console.log('Editing table:', tableId, table);
    
    setEditingTable(tableId);
    setNewTable({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location,
      features: table.features || [],
      isAvailable: table.isAvailable
    });
    setShowTableForm(true);
    setActiveTab('tables'); // Make sure we're on tables tab
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    
    if (!editingTable) {
      alert('No table selected for editing');
      return;
    }
    
    try {
      console.log('Updating table ID:', editingTable);
      console.log('Update data:', newTable);
      
      const response = await fetch(`${API_URL}/tables/${editingTable}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newTable)
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (response.ok) {
        await fetchTables();
        setNewTable({
          tableNumber: '',
          capacity: 4,
          location: 'main hall',
          features: [],
          isAvailable: true
        });
        setEditingTable(null);
        setShowTableForm(false);
        alert('Table updated successfully!');
      } else {
        console.error('Update failed:', data);
        alert(`Failed to update table: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error updating table:', err);
      alert(`Failed to update table: ${err.message}`);
    }
  };

  const handleDeleteTable = async (table) => {
    // Get the correct ID
    const tableId = table._id || table.id;
    
    if (!window.confirm(`Are you sure you want to delete Table ${table.tableNumber}?`)) {
      return;
    }

    try {
      console.log('Deleting table ID:', tableId);
      
      const response = await fetch(`${API_URL}/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        await fetchTables();
        alert('Table deleted successfully!');
      } else {
        console.error('Delete failed:', data);
        alert(`Failed to delete table: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      alert(`Failed to delete table: ${error.message}`);
    }
  };

  const handleEditReservation = (reservation) => {
    const reservationId = reservation.id || reservation._id;
    setEditingReservation(reservationId);
    
    // Format date properly
    let formattedDate = reservation.date;
    if (formattedDate) {
      const dateObj = new Date(formattedDate);
      formattedDate = dateObj.toISOString().split('T')[0];
    }
    
    setEditForm({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      date: formattedDate,
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

  const handleCancelTableEdit = () => {
    setEditingTable(null);
    setShowTableForm(false);
    setNewTable({
      tableNumber: '',
      capacity: 4,
      location: 'main hall',
      features: [],
      isAvailable: true
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

      const data = await response.json();

      if (response.ok) {
        await fetchReservations();
        setEditingReservation(null);
        alert('Reservation updated successfully!');
      } else {
        alert(`Failed to update reservation: ${data.message || data.error || 'Unknown error'}`);
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
        const data = await response.json();
        alert(`Failed to update reservation: ${data.message || data.error || 'Unknown error'}`);
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
        await fetchTables();
        alert('Reservation deleted successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to delete reservation: ${data.message || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation');
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

  // Format date for comparison (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const stats = {
    totalTables: tables.length,
    availableTables: tables.filter(t => t.isAvailable).length,
    totalReservations: reservations.length,
    todayReservations: reservations.filter(r => {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      return resDate === today;
    }).length,
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

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage restaurant tables and reservations</p>
      </div>

      <div className="admin-container">
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
                    {reservations.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
                        No reservations yet
                      </p>
                    ) : (
                      reservations.slice(0, 5).map(reservation => {
                        const resId = reservation.id || reservation._id;
                        return (
                          <div key={resId} className="recent-item">
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
                        );
                      })
                    )}
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
                  onClick={() => {
                    setShowTableForm(!showTableForm);
                    setEditingTable(null);
                    setNewTable({
                      tableNumber: '',
                      capacity: 4,
                      location: 'main hall',
                      features: [],
                      isAvailable: true
                    });
                  }}
                >
                  <FaPlus /> Add New Table
                </button>
              </div>

              {showTableForm && (
                <div className="table-form-card">
                  <h3>{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
                  <form onSubmit={editingTable ? handleUpdateTable : handleCreateTable}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Table Number</label>
                        <input
                          type="text"
                          value={newTable.tableNumber}
                          onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                          required
                          placeholder="e.g., W1, M2"
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
                          <option value="main hall">Main Hall</option>
                          <option value="window">Window</option>
                          <option value="private room">Private Room</option>
                          <option value="terrace">Terrace</option>
                          <option value="bar">Bar</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Available</label>
                        <select
                          value={newTable.isAvailable}
                          onChange={(e) => setNewTable({...newTable, isAvailable: e.target.value === 'true'})}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
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
                        {editingTable ? 'Update Table' : 'Create Table'}
                      </button>
                      <button 
                        type="button" 
                        className="btn-cancel"
                        onClick={handleCancelTableEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="tables-grid">
                {tables.map(table => {
                  return (
                    <div key={table._id || table.id} className="table-card">
                      <div className="table-header">
                        <h3>Table {table.tableNumber}</h3>
                        <span className={`table-status ${table.isAvailable ? 'available' : 'booked'}`}>
                          {table.isAvailable ? 'Available' : 'Unavailable'}
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
                        {table.features && table.features.length > 0 && (
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
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditTable(table)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDeleteTable(table)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                    {filteredReservations.map(reservation => {
                      const resId = reservation.id || reservation._id;
                      return (
                        <React.Fragment key={resId}>
                          {editingReservation === resId ? (
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
                                      onClick={() => handleSaveEdit(resId)}
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
                                  <div className="date">{new Date(reservation.date).toLocaleDateString()}</div>
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
                                      onClick={() => handleUpdateReservationStatus(resId, 'confirmed')}
                                      title="Confirm reservation"
                                    >
                                      <FaCheck />
                                    </button>
                                  )}
                                  {reservation.status === 'confirmed' && (
                                    <button 
                                      className="btn-action complete"
                                      onClick={() => handleUpdateReservationStatus(resId, 'completed')}
                                      title="Mark as completed"
                                    >
                                      <FaCheck />
                                    </button>
                                  )}
                                  <button 
                                    className="btn-action delete"
                                    onClick={() => handleDeleteReservation(resId)}
                                    title="Delete reservation"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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
                      <strong>{new Set(reservations.map(r => new Date(r.date).toISOString().split('T')[0])).size}</strong>
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
                  <h3>User Management</h3>
                  <div className="setting-content">
                    <p>Register new staff members or administrators</p>
                    <button 
                      className="btn-setting"
                      onClick={() => navigate('/login', { state: { adminRegistering: true } })}
                    >
                      Register New User
                    </button>
                  </div>
                </div>
                
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