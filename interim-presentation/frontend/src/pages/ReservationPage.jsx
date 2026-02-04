import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReservationForm from '../components/ReservationForm.jsx';
import './ReservationPage.css';

const API_URL = 'http://localhost:5000/api';

const ReservationPage = () => {
  const { user } = useAuth();
  const [availableTables, setAvailableTables] = useState(0);
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
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const satisfactionRate = 98;

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
              <span className="stat-label">Tables Available</span>
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
        <div className="content-wrapper-single">
          <ReservationForm onSuccess={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;