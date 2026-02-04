import React, { useState, useEffect } from 'react';
import { FaChair, FaTimes, FaCheck, FaCog, FaInfoCircle } from 'react-icons/fa';
import './TableSelector.css';

const API_URL = 'http://localhost:5000/api';

const TableSelector = ({ 
  selectedDate, 
  selectedTime, 
  partySize, 
  onTablesChange,
  userToken 
}) => {
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedTables, setBookedTables] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchBookedTables();
    }
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    onTablesChange(selectedTables);
  }, [selectedTables, onTablesChange]);

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
      const response = await fetch(
        `${API_URL}/reservations/date/${selectedDate}`
      );
      const data = await response.json();
      
      // Filter reservations for the specific time
      const tablesBookedAtTime = data
        .filter(reservation => reservation.time === selectedTime)
        .map(reservation => reservation.tableNumber);
      
      setBookedTables(tablesBookedAtTime);
    } catch (error) {
      console.error('Error fetching booked tables:', error);
    }
  };

  const handleTableSelect = (table) => {
    // Check if table is available
    if (table.status !== 'available' || bookedTables.includes(table.tableNumber)) {
      return;
    }

    // Check if adding this table would exceed party size
    const currentCapacity = selectedTables.reduce((total, t) => total + t.capacity, 0);
    if (currentCapacity + table.capacity > partySize) {
      alert(`Total capacity would exceed your party size of ${partySize}.`);
      return;
    }

    // Check if table is already selected
    if (selectedTables.find(t => t.id === table.id)) {
      handleTableDeselect(table.id);
      return;
    }

    setSelectedTables([...selectedTables, table]);
  };

  const handleTableDeselect = (tableId) => {
    setSelectedTables(selectedTables.filter(table => table.id !== tableId));
  };

  const clearSelection = () => {
    setSelectedTables([]);
  };

  const getTableStatus = (table) => {
    if (bookedTables.includes(table.tableNumber)) {
      return 'booked';
    }
    return table.status || 'available';
  };

  const getTableCapacity = (table) => {
    return `${table.capacity} ${table.capacity === 1 ? 'person' : 'people'}`;
  };

  const groupTablesByLocation = () => {
    const grouped = {};
    tables.forEach(table => {
      if (!grouped[table.location]) {
        grouped[table.location] = [];
      }
      grouped[table.location].push(table);
    });
    return grouped;
  };

  const getLocationIcon = (location) => {
    switch(location) {
      case 'Main Hall': return '🏛️';
      case 'Window': return '🪟';
      case 'Private Room': return '🚪';
      case 'Patio': return '🌿';
      case 'Bar': return '🍸';
      case 'Garden': return '🌳';
      default: return '🏷️';
    }
  };

  if (loading) {
    return (
      <div className="table-selector-container">
        <div className="loading-container">Loading tables...</div>
      </div>
    );
  }

  const groupedTables = groupTablesByLocation();
  const totalSelectedCapacity = selectedTables.reduce((sum, table) => sum + table.capacity, 0);

  return (
    <div className="table-selector-container">
      <div className="table-selector-header">
        <h3>Select Your Table(s)</h3>
        <div className="selection-info">
          {selectedTables.length > 0 && (
            <>
              <div className="selection-summary">
                Selected: {selectedTables.length} table(s) • Capacity: {totalSelectedCapacity}/{partySize}
              </div>
              <button 
                className="clear-selection"
                onClick={clearSelection}
              >
                <FaTimes /> Clear
              </button>
            </>
          )}
        </div>
      </div>

      <div className="restaurant-layout">
        {Object.entries(groupedTables).map(([location, locationTables]) => (
          <div key={location} className="layout-section">
            <h4 className="section-title">
              <span>{getLocationIcon(location)}</span>
              {location}
            </h4>
            
            <div className="tables-grid">
              {locationTables.map(table => {
                const status = getTableStatus(table);
                const isSelected = selectedTables.find(t => t.id === table.id);
                
                return (
                  <div
                    key={table.id}
                    className={`table-item ${status} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleTableSelect(table)}
                  >
                    <div className="table-number">Table {table.tableNumber}</div>
                    <div className="table-capacity">{getTableCapacity(table)}</div>
                    
                    <div className="table-status">
                      {status === 'available' && <FaCheck />}
                      {status === 'booked' && <FaTimes />}
                      {status === 'maintenance' && <FaCog />}
                    </div>
                    
                    {table.features && table.features.length > 0 && (
                      <div className="table-features">
                        {table.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color maintenance"></div>
          <span>Maintenance</span>
        </div>
      </div>

      {selectedTables.length > 0 && (
        <div className="selected-tables-list">
          <h4>Selected Tables:</h4>
          <div className="selected-tables-container">
            {selectedTables.map(table => (
              <div key={table.id} className="selected-table-item">
                <FaChair />
                <span>Table {table.tableNumber} ({table.capacity})</span>
                <button 
                  className="remove-table"
                  onClick={() => handleTableDeselect(table.id)}
                  title="Remove table"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#7f8c8d' }}>
            <FaInfoCircle /> Total capacity: {totalSelectedCapacity} people
          </p>
        </div>
      )}

      {!selectedDate || !selectedTime ? (
        <div className="info-message" style={{
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#856404'
        }}>
          <FaInfoCircle /> Please select a date and time first to see table availability.
        </div>
      ) : selectedTables.length === 0 ? (
        <div className="info-message" style={{
          padding: '15px',
          background: '#e8f4fc',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#3498db'
        }}>
          <FaInfoCircle /> Click on available tables to select. Selected tables will turn blue.
        </div>
      ) : totalSelectedCapacity < partySize ? (
        <div className="info-message" style={{
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#856404'
        }}>
          <FaInfoCircle /> You can select more tables to accommodate all {partySize} people.
        </div>
      ) : (
        <div className="success-message" style={{
          padding: '15px',
          background: '#d4edda',
          borderRadius: '8px',
          marginTop: '20px',
          color: '#155724'
        }}>
          <FaCheck /> Perfect! Your selected tables can accommodate all {partySize} people.
        </div>
      )}
    </div>
  );
};

export default TableSelector;