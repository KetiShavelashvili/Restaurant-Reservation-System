import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReservationForm from '../components/ReservationForm.jsx';
import './ReservationPage.css';

const API_URL = 'http://localhost:5000/api';

const ReservationPage = () => {
  const { user } = useAuth();
  const [availableTables, setAvailableTables] = useState(0);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch tables
      const tablesResponse = await fetch(`${API_URL}/tables`);
      const tablesData = await tablesResponse.json();
      const available = tablesData.filter(t => t.isAvailable).length;
      setAvailableTables(available);

      // Fetch user's recent reservations if logged in
      if (user) {
        const reservationsResponse = await fetch(`${API_URL}/reservations`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const reservationsData = await reservationsResponse.json();
        setRecentReservations(reservationsData.slice(0, 3)); // Last 3 reservations
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const satisfactionRate = 98; // This could come from your backend
  const totalReservations = recentReservations.length;

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <div className="header-content">
          <h1>Book Your Perfect Table</h1>
          <p className="subtitle">
            {user ? `Welcome back, ${user.name}!` : 'Experience exceptional dining with our easy reservation system'}
          </p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{loading ? '...' : availableTables}</span>
              <span className="stat-label">Tables Available Now</span>
            </div>
            <div className="stat">
              <span className="stat-number">{satisfactionRate}%</span>
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
            <ReservationForm onSuccess={fetchData} />
          </div>
          
          <div className="info-section">
            {user && recentReservations.length > 0 && (
              <div className="info-card recent-reservations">
                <h3>📅 Your Recent Reservations</h3>
                <div className="recent-list">
                  {recentReservations.map(reservation => (
                    <div key={reservation.id} className="recent-item">
                      <div className="recent-info">
                        <div className="recent-date">{reservation.date}</div>
                        <div className="recent-time">{reservation.time}</div>
                      </div>
                      <span 
                        className={`recent-status status-${reservation.status}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                  ))}
                </div>
                <a href="/my-reservations" className="view-all-link">
                  View all reservations →
                </a>
              </div>
            )}

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