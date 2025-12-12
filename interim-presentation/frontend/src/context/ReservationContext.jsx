import React, { createContext, useState, useContext, useEffect } from 'react';
import { reservationAPI, tableAPI } from '../services/api';

// Create the reservation context
const ReservationContext = createContext();

// Custom hook for easy access
export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  // Stores all reservations from the database
  const [reservations, setReservations] = useState([]);

  // Stores all tables (both available + reserved)
  const [tables, setTables] = useState([]);

  // Stores only available tables (free tables)
  const [availableTables, setAvailableTables] = useState([]);

  // Loading & error states (shared across all reservation actions)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all initial data on component mount, this ensures the app has fresh table and reservation data immediately.
  useEffect(() => {
    loadAllData();
  }, []);

  // load all data, literally
  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load all tables + all reservations simultaneously
      await Promise.all([loadTables(), loadReservations()]);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tables from API and store them, also fetch a list of only available tables
  const loadTables = async () => {
    try {
      const response = await tableAPI.getAllTables();
      setTables(response.data);

      const availableResponse = await tableAPI.getAvailableTables();
      setAvailableTables(availableResponse.data);
    } catch (err) {
      throw new Error('Failed to load tables');
    }
  };

  // Fetch and store all reservations from API
  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAllReservations();
      setReservations(response.data);
    } catch (err) {
      throw new Error('Failed to load reservations');
    }
  };

  // Create a new reservation
  const createReservation = async (reservationData) => {
    try {
      setLoading(true);

      const response = await reservationAPI.createReservation(reservationData);
      const newReservation = response.data;

      // Add newly created reservation to state
      setReservations(prev => [...prev, newReservation]);

      // Refresh tables since one may now be unavailable
      await loadTables();

      return newReservation;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create reservation';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing reservation by ID, updates list locally without reloading the entire list.
  const updateReservation = async (id, updateData) => {
    try {
      setLoading(true);

      const response = await reservationAPI.updateReservation(id, updateData);
      const updatedReservation = response.data;

      // Replace the updated reservation in local state
      setReservations(prev =>
        prev.map(res => (res.id === id ? updatedReservation : res))
      );

      return updatedReservation;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update reservation';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  //  Delete a reservation by ID and it also reloads tables because deleting frees up a table.
  const deleteReservation = async (id) => {
    try {
      setLoading(true);

      await reservationAPI.deleteReservation(id);

      // Remove reservation from list
      setReservations(prev => prev.filter(res => res.id !== id));

      // After deletion, the table becomes available → reload tables
      await loadTables();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete reservation';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value that can be accessed anywhere in the app
  const value = {
    reservations,          // All reservations
    tables,                // All tables
    availableTables,       // Only available tables

    loading,               // Loading state
    error,                 // Error message (if any)

    createReservation,
    updateReservation,
    deleteReservation,

    loadReservations,
    loadTables,
    loadAllData,

    clearError: () => setError(null),   // Helper to manually clear errors
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};
