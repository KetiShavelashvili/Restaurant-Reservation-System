import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ReservationForm.css';

const API_URL = 'http://localhost:5000/api';

const ReservationForm = ({ onSuccess }) => {
  const { user } = useAuth();          // Get logged-in user info
  const navigate = useNavigate();      // Navigation hook

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Table data states
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Form data (pre-fill name/email)
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    date: '',
    time: '',
    partySize: 2,
    tableId: '',
    notes: ''
  });

  // Sync name/email with user when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email
      }));
    }
  }, [user]);

  // Fetch available tables when: date, time, or party size changes
  useEffect(() => {
    if (formData.partySize && formData.date && formData.time) {
      fetchAvailableTablesForReservation();
    } else {
      // Reset tables if fields are incomplete
      setAvailableTables([]);
      setSelectedTable(null);
    }
  }, [formData.partySize, formData.date, formData.time]);

  // Fetch all tables, then filter them by: being available having enough capacity for selected party size
  const fetchAvailableTablesForReservation = async () => {
    setLoadingTables(true);

    try {
      const response = await fetch(`${API_URL}/tables`);
      const data = await response.json();

      // Filter suitable tables
      const suitable = data.filter(t =>
        t.isAvailable && t.capacity >= formData.partySize
      );

      setAvailableTables(suitable);

      // Auto-select first table
      if (suitable.length > 0 && !selectedTable) {
        setSelectedTable(suitable[0]);
        setFormData(prev => ({
          ...prev,
          tableId: suitable[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoadingTables(false);
    }
  };

  // When user selects a table from grid
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setFormData(prev => ({
      ...prev,
      tableId: table.id
    }));
  };

  // Handle changes for all form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setError('');

    // If party size changes, reset selected table + tableId
    if (name === 'partySize') {
      setSelectedTable(null);
      setFormData(prev => ({
        ...prev,
        tableId: ''
      }));
    }
  };

  // Handle final form submission - POST /reservations
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Require table selection
    if (!formData.tableId) {
      setError('Please select a table');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.error || data.message || 'Failed to create reservation');
      }

      // Show success message
      setSuccess(true);

      // Reset form but keep logged-in user’s name/email
      setFormData({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        date: '',
        time: '',
        partySize: 2,
        tableId: '',
        notes: ''
      });

      setSelectedTable(null);
      setAvailableTables([]);

      // Run parent callback if exists
      if (onSuccess) {
        onSuccess();
      }

      // Auto-redirect to user’s reservation list
      setTimeout(() => {
        navigate('/my-reservations');
      }, 2000);

    } catch (err) {
      console.error('Reservation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate min/max date validation (today -> 60 days forward)
  const today = new Date().toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="reservation-form-container">
      <div className="form-header">
        <h2>Make a Reservation</h2>
        <p>Fill in the details below to reserve your table</p>
      </div>

      {/* Success message */}
      {success && (
        <div className="alert alert-success">
          Reservation created successfully! Redirecting to your reservations...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Main reservation form */}
      <form onSubmit={handleSubmit} className="reservation-form">

        {/* PERSONAL INFO */}
        <div className="form-section">
          <h3>Personal Information</h3>

          <div className="form-group">
            <label htmlFor="customerName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={!!user}     // user can't change auto-filled info
            />
          </div>

          <div className="form-row">
            {/* Email */}
            <div className="form-group">
              <label htmlFor="customerEmail">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                disabled={!!user}
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="customerPhone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
        </div>

        {/* RESERVATION DETAILS */}
        <div className="form-section">
          <h3>Reservation Details</h3>

          <div className="form-row">
            {/* Date */}
            <div className="form-group">
              <label htmlFor="date">
                Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
                max={maxDateString}
              />
            </div>

            {/* Time */}
            <div className="form-group">
              <label htmlFor="time">
                Time <span className="required">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                min="17:00"
                max="23:00"
              />
              <small className="form-hint">Restaurant hours: 5:00 PM - 11:00 PM</small>
            </div>
          </div>

          {/* Party Size */}
          <div className="form-group">
            <label htmlFor="partySize">
              Party Size <span className="required">*</span>
            </label>
            <select
              id="partySize"
              name="partySize"
              value={formData.partySize}
              onChange={handleChange}
              required
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* TABLE SELECTION */}
          {formData.date && formData.time && formData.partySize && (
            <div className="form-group table-selection">
              <label>
                Select Table <span className="required">*</span>
              </label>

              {/* While loading tables */}
              {loadingTables ? (
                <div className="loading-tables">
                  <div className="spinner"></div>
                  <p>Finding available tables...</p>
                </div>

              ) : availableTables.length === 0 ? (
                // No tables found
                <div className="no-tables-message">
                  <p>😔 No tables available for {formData.partySize} people at this time.</p>
                  <small>Please try a different time or party size.</small>
                </div>

              ) : (
                <>
                  {/* Table grid */}
                  <div className="tables-grid-selection">
                    {availableTables.map(table => (
                      <div
                        key={table.id}
                        className={`table-option ${selectedTable?.id === table.id ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(table)}
                      >
                        <div className="table-number">Table {table.tableNumber}</div>

                        <div className="table-info">
                          <div className="table-capacity">
                            <span className="icon">👥</span>
                            <span>{table.capacity} seats</span>
                          </div>

                          <div className="table-location">
                            <span className="icon">📍</span>
                            <span>{table.location}</span>
                          </div>
                        </div>

                        {/* Optional small features list */}
                        {table.features && table.features.length > 0 && (
                          <div className="table-features">
                            {table.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="feature-tag-small">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Selected badge */}
                        {selectedTable?.id === table.id && (
                          <div className="selected-badge">✓ Selected</div>
                        )}
                      </div>
                    ))}
                  </div>

                  <small className="form-hint">
                    {availableTables.length} table{availableTables.length !== 1 ? 's' : ''} available for your party
                  </small>
                </>
              )}
            </div>
          )}

          {/* OPTIONAL MESSAGE */}
          <div className="form-group">
            <label htmlFor="notes">
              Special Requests (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Any special requests, dietary restrictions, or celebrations we should know about?"
            />
          </div>
        </div>

        {/* FORM FOOTER */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Reservation'}
          </button>

          <p className="form-note">
            * By submitting this form, you agree to our reservation policy
          </p>
        </div>

      </form>
    </div>
  );
};

export default ReservationForm;
