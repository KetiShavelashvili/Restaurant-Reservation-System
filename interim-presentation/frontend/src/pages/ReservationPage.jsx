import React from 'react';
import './ReservationPage.css';

const ReservationPage = () => {
  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <div className="header-content">
          <h1>Book Your Perfect Table</h1>
          <p className="subtitle">
            Experience exceptional dining with our easy reservation system
          </p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">15</span>
              <span className="stat-label">Tables Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Online Booking</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="reservation-content">
        <div className="content-wrapper">
          <div className="form-section">
            <ReservationForm />
          </div>
          
          <div className="info-section">
            <div className="info-card">
              <h3>📍 Restaurant Information</h3>
              <div className="info-details">
                <p><strong>Address:</strong> 123 Gourmet Street, Food District</p>
                <p><strong>Hours:</strong> 5:00 PM - 11:00 PM (Daily)</p>
                <p><strong>Phone:</strong> (123) 456-7890</p>
                <p><strong>Email:</strong> reservations@gourmetreserve.com</p>
              </div>
            </div>
            
            <div className="info-card">
              <h3>📋 Reservation Policy</h3>
              <ul className="policy-list">
                <li>Reservations can be made up to 60 days in advance</li>
                <li>Please arrive 15 minutes before your reservation</li>
                <li>Cancellations must be made at least 2 hours in advance</li>
                <li>Large groups (8+) require special arrangements</li>
                <li>Dress code: Smart casual</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>⭐ Special Features</h3>
              <div className="features-list">
                <div className="feature">
                  <span className="feature-icon">🎂</span>
                  <span>Birthday Celebrations</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💝</span>
                  <span>Anniversary Packages</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌱</span>
                  <span>Vegetarian/Vegan Options</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">♿</span>
                  <span>Wheelchair Accessible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;