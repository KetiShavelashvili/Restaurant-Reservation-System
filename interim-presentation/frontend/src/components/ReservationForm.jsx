import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ReservationForm.css';

const API_URL = 'http://localhost:5000/api';

const ReservationForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name,
        customerEmail: user.email
      }));
    }
  }, [user]);

  // Fetch available tables when party size, date, or time changes
  useEffect(() => {
    if (formData.partySize && formData.date && formData.time) {
      fetchAvailableTablesForReservation();
    } else {
      setAvailableTables([]);
      setSelectedTable(null);
    }
  }, [formData.partySize, formData.date, formData.time]);

  const fetchAvailableTablesForReservation = async () => {
    setLoadingTables(true);
    try {
      const response = await fetch(`${API_URL}/tables`);
      const data = await response.json();
      
      // Filter tables that match the party size and are available
      const suitable = data.filter(t => 
        t.isAvailable && t.capacity >= formData.partySize
      );
      
      setAvailableTables(suitable);
      
      // Auto-select first table if available
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

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setFormData(prev => ({
      ...prev,
      tableId: table.id
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    
    // Reset selected table when party size changes
    if (name === 'partySize') {
      setSelectedTable(null);
      setFormData(prev => ({
        ...prev,
        tableId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate table selection
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

      setSuccess(true);
      
      // Reset form but keep user info
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

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Show success message and redirect after 2 seconds
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

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Get max date (60 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="reservation-form-container">
      <div className="form-header">
        <h2>Make a Reservation</h2>
        <p>Fill in the details below to reserve your table</p>
      </div>

      {success && (
        <div className="alert alert-success">
          ✅ Reservation created successfully! Redirecting to your reservations...
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="reservation-form">
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
              disabled={!!user}
            />
          </div>

          <div className="form-row">
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

        <div className="form-section">
          <h3>Reservation Details</h3>
          
          <div className="form-row">
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Table Selection Section */}
          {formData.date && formData.time && formData.partySize && (
            <div className="form-group table-selection">
              <label>
                Select Table <span className="required">*</span>
              </label>
              
              {loadingTables ? (
                <div className="loading-tables">
                  <div className="spinner"></div>
                  <p>Finding available tables...</p>
                </div>
              ) : availableTables.length === 0 ? (
                <div className="no-tables-message">
                  <p>😔 No tables available for {formData.partySize} people at this time.</p>
                  <small>Please try a different time or party size.</small>
                </div>
              ) : (
                <>
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
                        {table.features && table.features.length > 0 && (
                          <div className="table-features">
                            {table.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="feature-tag-small">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
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