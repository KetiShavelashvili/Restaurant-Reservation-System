import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useReservation } from '../context/ReservationContext';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationForm.css';

const ReservationForm = () => {
  const { createReservation, availableTables, loading } = useReservation();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: new Date(),
    time: '19:00',
    partySize: 2,
    notes: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formattedDate = formData.date.toISOString().split('T')[0];
      const reservationData = {
        ...formData,
        date: formattedDate,
      };

      const result = await createReservation(reservationData);
      setSuccessMessage(`🎉 Reservation confirmed! Your table number is ${result.tableNumber}`);
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: new Date(),
        time: '19:00',
        partySize: 2,
        notes: '',
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to create reservation. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30'
  ];

  return (
    <div className="reservation-form-container">
      <div className="form-header">
        <h2>Make a Reservation</h2>
        <p>Fill in your details to book a table</p>
      </div>
      
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                required
                placeholder="email@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                placeholder="123-456-7890"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Reservation Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="date-picker"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Party Size *</label>
              <select
                name="partySize"
                value={formData.partySize}
                onChange={handleChange}
                required
                disabled={loading}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requests, dietary restrictions, or occasion notes?"
              rows="3"
              disabled={loading}
            />
          </div>
        </div>

        <div className="availability-section">
          <h4>📊 Table Availability</h4>
          <div className="availability-info">
            <div className="availability-stats">
              <span className="stat">
                <strong>{availableTables.length}</strong> tables available
              </span>
              <span className="stat">
                <strong>{availableTables.filter(t => t.capacity >= formData.partySize).length}</strong> tables for {formData.partySize} people
              </span>
            </div>
            
            {availableTables.length === 0 ? (
              <div className="alert alert-warning">
                ⚠️ No tables available for the selected party size. Please try a different time or smaller party.
              </div>
            ) : (
              <div className="tables-preview">
                <p>Available tables:</p>
                <div className="tables-list">
                  {availableTables.slice(0, 3).map(table => (
                    <div key={table.id} className="table-preview">
                      <span className="table-number">Table {table.tableNumber}</span>
                      <span className="table-capacity">({table.capacity} seats)</span>
                    </div>
                  ))}
                  {availableTables.length > 3 && (
                    <span className="more-tables">+{availableTables.length - 3} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={availableTables.length === 0 || loading}
        >
          {loading ? 'Booking...' : 'Book Table Now'}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;