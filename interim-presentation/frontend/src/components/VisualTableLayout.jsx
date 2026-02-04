import React, { useState, useEffect } from 'react';
import { FaChair, FaCheck, FaTimes, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import './VisualTableLayout.css';

const API_URL = 'http://localhost:5000/api';

const VisualTableLayout = ({ 
  selectedDate, 
  selectedTime, 
  partySize,
  onTableSelect,
  selectedTableId 
}) => {
  const [tables, setTables] = useState([]);
  const [bookedTables, setBookedTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchBookedTables();
    }
  }, [selectedDate, selectedTime]);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/tables`);
      const data = await response.json();
      setTables(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setLoading(false);
    }
  };

  const fetchBookedTables = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations/date/${selectedDate}`);
      const data = await response.json();
      
      // Get table IDs that are booked at the selected time
      const bookedIds = data
        .filter(reservation => 
          reservation.time === selectedTime && 
          reservation.status !== 'cancelled'
        )
        .map(reservation => reservation.tableId);
      
      setBookedTables(bookedIds);
    } catch (error) {
      console.error('Error fetching booked tables:', error);
    }
  };

  const isTableAvailable = (table) => {
    // Check if table is generally available
    if (!table.isAvailable) return false;
    
    // Check if table is booked at selected time
    if (bookedTables.includes(table.id)) return false;
    
    // Check if table has enough capacity
    if (partySize && table.capacity < partySize) return false;
    
    return true;
  };

  const handleTableClick = (table) => {
    if (!isTableAvailable(table)) return;
    if (!selectedDate || !selectedTime || !partySize) {
      alert('Please select date, time, and party size first');
      return;
    }
    onTableSelect(table);
  };

  const groupTablesByLocation = () => {
    const grouped = {};
    tables.forEach(table => {
      const location = table.location || 'main hall';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(table);
    });
    return grouped;
  };

  const getLocationIcon = (location) => {
    const locationLower = location.toLowerCase();
    if (locationLower.includes('window')) return '🪟';
    if (locationLower.includes('private')) return '🚪';
    if (locationLower.includes('terrace') || locationLower.includes('patio')) return '🌿';
    if (locationLower.includes('bar')) return '🍸';
    if (locationLower.includes('garden')) return '🌳';
    return '🍽️';
  };

  const getTableShape = (capacity) => {
    if (capacity <= 2) return 'square';
    if (capacity <= 4) return 'round';
    if (capacity <= 6) return 'rectangle';
    return 'large-rectangle';
  };

  if (loading) {
    return (
      <div className="visual-table-layout">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading restaurant layout...</p>
        </div>
      </div>
    );
  }

  const groupedTables = groupTablesByLocation();

  return (
    <div className="visual-table-layout">
      <div className="layout-header">
        <h3>🍽️ Restaurant Floor Plan</h3>
        <p className="layout-subtitle">
          {selectedDate && selectedTime 
            ? `Showing availability for ${selectedDate} at ${selectedTime}`
            : 'Select date and time to see availability'}
        </p>
      </div>

      {!selectedDate || !selectedTime || !partySize ? (
        <div className="info-banner">
          <FaMapMarkerAlt />
          <p>Please select date, time, and party size to see available tables</p>
        </div>
      ) : null}

      <div className="restaurant-floor">
        {Object.entries(groupedTables).map(([location, locationTables]) => (
          <div key={location} className="location-section">
            <div className="location-header">
              <span className="location-icon">{getLocationIcon(location)}</span>
              <h4>{location.charAt(0).toUpperCase() + location.slice(1)}</h4>
              <span className="table-count">
                {locationTables.filter(t => isTableAvailable(t)).length}/{locationTables.length} available
              </span>
            </div>
            
            <div className="tables-visual-grid">
              {locationTables.map(table => {
                const available = isTableAvailable(table);
                const isBooked = bookedTables.includes(table.id);
                const tooSmall = partySize && table.capacity < partySize;
                const isSelected = selectedTableId === table.id;
                const shape = getTableShape(table.capacity);
                
                return (
                  <div
                    key={table.id}
                    className={`visual-table ${shape} ${
                      isSelected ? 'selected' : 
                      available ? 'available' : 
                      isBooked ? 'booked' : 
                      tooSmall ? 'too-small' :
                      'unavailable'
                    }`}
                    onClick={() => handleTableClick(table)}
                    title={
                      isBooked ? 'This table is already booked' :
                      tooSmall ? `This table is too small (capacity: ${table.capacity})` :
                      !table.isAvailable ? 'This table is currently unavailable' :
                      `Table ${table.tableNumber} - Seats ${table.capacity}`
                    }
                  >
                    {/* Table Top */}
                    <div className="table-top">
                      <span className="table-number">{table.tableNumber}</span>
                      
                      {/* Status indicator */}
                      <div className="status-indicator">
                        {isSelected && <FaCheck />}
                        {isBooked && !isSelected && <FaTimes />}
                      </div>
                    </div>
                    
                    {/* Chairs around the table */}
                    <div className="chairs-container">
                      {[...Array(Math.min(table.capacity, 8))].map((_, idx) => (
                        <div key={idx} className={`chair chair-${idx}`}>
                          <FaChair />
                        </div>
                      ))}
                    </div>
                    
                    {/* Table info */}
                    <div className="table-info-overlay">
                      <div className="capacity-badge">
                        <FaUsers /> {table.capacity}
                      </div>
                      
                      {table.features && table.features.length > 0 && (
                        <div className="features-tags">
                          {table.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="feature-tag-mini">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="layout-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="legend-box too-small"></div>
            <span>Too Small</span>
          </div>
          <div className="legend-item">
            <div className="legend-box unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>

      {/* Selected table info */}
      {selectedTableId && (
        <div className="selected-table-info">
          {tables.find(t => t.id === selectedTableId) && (
            <>
              <FaCheck className="check-icon" />
              <div className="selected-info-text">
                <strong>Selected: Table {tables.find(t => t.id === selectedTableId).tableNumber}</strong>
                <span>Capacity: {tables.find(t => t.id === selectedTableId).capacity} people</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VisualTableLayout;