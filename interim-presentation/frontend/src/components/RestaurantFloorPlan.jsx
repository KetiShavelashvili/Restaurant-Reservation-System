import React, { useState, useEffect } from 'react';
import { FaChair, FaCheck, FaTimes } from 'react-icons/fa';
import './RestaurantFloorPlan.css';

const API_URL = 'http://localhost:5000/api';

const RestaurantFloorPlan = ({ 
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
    if (!table.isAvailable) return false;
    if (bookedTables.includes(table.id)) return false;
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

  const getTableStatus = (table) => {
    if (selectedTableId === table.id) return 'selected';
    if (bookedTables.includes(table.id)) return 'booked';
    if (partySize && table.capacity < partySize) return 'too-small';
    if (!table.isAvailable) return 'unavailable';
    return 'available';
  };

  // Organize tables by their actual location for floor plan
  const getTablesByLocation = (location) => {
    return tables.filter(t => t.location.toLowerCase() === location.toLowerCase());
  };

  if (loading) {
    return (
      <div className="floor-plan-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading restaurant floor plan...</p>
        </div>
      </div>
    );
  }

  const windowTables = getTablesByLocation('window');
  const mainHallTables = getTablesByLocation('main hall');
  const privateRoomTables = getTablesByLocation('private room');
  const terraceTables = getTablesByLocation('terrace');
  const barTables = getTablesByLocation('bar');

  return (
    <div className="floor-plan-container">
      <div className="floor-plan-header">
        <h3>🏛️ Restaurant Floor Plan</h3>
        <p className="floor-plan-subtitle">
          {selectedDate && selectedTime 
            ? `Select your table for ${selectedDate} at ${selectedTime}`
            : 'Choose date, time, and party size to see availability'}
        </p>
      </div>

      {!selectedDate || !selectedTime || !partySize ? (
        <div className="info-message">
          <p>📅 Please select date, time, and party size above to view available tables</p>
        </div>
      ) : null}

      {/* Restaurant Floor Plan Layout */}
      <div className="restaurant-floor">
        
        {/* Entrance */}
        <div className="entrance-area">
          <div className="entrance-door">
            <span>🚪 ENTRANCE</span>
          </div>
        </div>

        {/* Main Floor Layout */}
        <div className="floor-grid">
          
          {/* Left Side - Window Section */}
          <div className="window-section">
            <div className="section-label">Window View</div>
            <div className="window-wall">🪟 🪟 🪟 </div>
            <div className="window-tables-grid">
              {windowTables.map((table) => (
                <div
                  key={table.id}
                  className={`floor-table ${getTableStatus(table)}`}
                  onClick={() => handleTableClick(table)}
                  title={`Table ${table.tableNumber} - ${table.capacity} seats`}
                >
                  <div className="table-shape">
                    <span className="table-label">{table.tableNumber}</span>
                    <span className="table-capacity">{table.capacity}p</span>
                    {getTableStatus(table) === 'selected' && (
                      <FaCheck className="check-icon" />
                    )}
                    {getTableStatus(table) === 'booked' && (
                      <FaTimes className="cross-icon" />
                    )}
                  </div>
                  <div className="table-chairs">
                    <FaChair className="chair top-left" />
                    <FaChair className="chair top-right" />
                    <FaChair className="chair bottom-right" />
                    <FaChair className="chair bottom-left" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Main Hall */}
          <div className="main-hall-section">
            <div className="section-label">Main Dining Hall</div>
            <div className="main-hall-grid">
              {mainHallTables.map((table) => (
                <div
                  key={table.id}
                  className={`floor-table ${getTableStatus(table)}`}
                  onClick={() => handleTableClick(table)}
                  title={`Table ${table.tableNumber} - ${table.capacity} seats`}
                >
                  <div className="table-shape">
                    <span className="table-label">{table.tableNumber}</span>
                    <span className="table-capacity">{table.capacity}p</span>
                    {getTableStatus(table) === 'selected' && (
                      <FaCheck className="check-icon" />
                    )}
                    {getTableStatus(table) === 'booked' && (
                      <FaTimes className="cross-icon" />
                    )}
                  </div>
                  <div className="table-chairs">
                    <FaChair className="chair top" />
                    <FaChair className="chair right" />
                    <FaChair className="chair bottom" />
                    <FaChair className="chair left" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Private Rooms */}
          <div className="private-section">
            <div className="section-label">Private Rooms</div>
            <div className="private-rooms">
              {privateRoomTables.map((table, idx) => (
                <div key={table.id} className="private-room">
                  <div className="room-door">🚪</div>
                  <div
                    className={`floor-table large ${getTableStatus(table)}`}
                    onClick={() => handleTableClick(table)}
                    title={`Table ${table.tableNumber} - ${table.capacity} seats - Private Room`}
                  >
                    <div className="table-shape">
                      <span className="table-label">{table.tableNumber}</span>
                      <span className="table-capacity">{table.capacity}p</span>
                      {getTableStatus(table) === 'selected' && (
                        <FaCheck className="check-icon" />
                      )}
                      {getTableStatus(table) === 'booked' && (
                        <FaTimes className="cross-icon" />
                      )}
                    </div>
                    <div className="table-chairs">
                      <FaChair className="chair top-left" />
                      <FaChair className="chair top-right" />
                      <FaChair className="chair right" />
                      <FaChair className="chair bottom-right" />
                      <FaChair className="chair bottom-left" />
                      <FaChair className="chair left" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom - Bar/Terrace if exists */}
        {(barTables.length > 0 || terraceTables.length > 0) && (
          <div className="bottom-section">
            {barTables.length > 0 && (
              <div className="bar-section">
                <div className="section-label">Bar Area 🍸</div>
                <div className="bar-counter"></div>
                <div className="bar-tables">
                  {barTables.map((table) => (
                    <div
                      key={table.id}
                      className={`floor-table small ${getTableStatus(table)}`}
                      onClick={() => handleTableClick(table)}
                      title={`Table ${table.tableNumber} - ${table.capacity} seats - Bar`}
                    >
                      <div className="table-shape">
                        <span className="table-label">{table.tableNumber}</span>
                        <span className="table-capacity">{table.capacity}p</span>
                        {getTableStatus(table) === 'selected' && (
                          <FaCheck className="check-icon" />
                        )}
                      </div>
                      <div className="table-chairs">
                        <FaChair className="chair top" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {terraceTables.length > 0 && (
              <div className="terrace-section">
                <div className="section-label">Terrace 🌿</div>
                <div className="terrace-area">
                  {terraceTables.map((table) => (
                    <div
                      key={table.id}
                      className={`floor-table ${getTableStatus(table)}`}
                      onClick={() => handleTableClick(table)}
                      title={`Table ${table.tableNumber} - ${table.capacity} seats - Terrace`}
                    >
                      <div className="table-shape">
                        <span className="table-label">{table.tableNumber}</span>
                        <span className="table-capacity">{table.capacity}p</span>
                        {getTableStatus(table) === 'selected' && (
                          <FaCheck className="check-icon" />
                        )}
                      </div>
                      <div className="table-chairs">
                        <FaChair className="chair top" />
                        <FaChair className="chair right" />
                        <FaChair className="chair bottom" />
                        <FaChair className="chair left" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Legend */}
      <div className="floor-plan-legend">
        <div className="legend-item">
          <div className="legend-indicator available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator too-small"></div>
          <span>Too Small</span>
        </div>
      </div>

      {/* Selected Table Info */}
      {selectedTableId && tables.find(t => t.id === selectedTableId) && (
        <div className="selected-info-bar">
          <FaCheck className="check-icon" />
          <span>
            Selected: <strong>Table {tables.find(t => t.id === selectedTableId).tableNumber}</strong> 
            {' '}({tables.find(t => t.id === selectedTableId).capacity} people)
            {' '}in {tables.find(t => t.id === selectedTableId).location}
          </span>
        </div>
      )}
    </div>
  );
};

export default RestaurantFloorPlan;