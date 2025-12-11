import React, { createContext, useState, useContext, useEffect } from 'react';
import { reservationAPI, tableAPI } from '../services/api';

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadTables(), loadReservations()]);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchAvailableTables = async ({ date, time, partySize }) => {
    try {
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const response = await tableAPI.getAvailableTables({
        params: { date: formattedDate, time, partySize }
      });
      setAvailableTables(response.data);
      console.log('Fetched available tables:', response.data);
    } catch (err) {
      console.error('Failed to fetch available tables', err);
      setAvailableTables([]);
    }
  };


  const loadReservations = async () => {
    try {
      const response = await reservationAPI.getAllReservations();
      setReservations(response.data);
    } catch (err) {
      throw new Error('Failed to load reservations');
    }
  };

  const createReservation = async (reservationData) => {
    try {
      setLoading(true);
      const response = await reservationAPI.createReservation(reservationData);
      const newReservation = response.data;
      
      setReservations(prev => [...prev, newReservation]);
      await loadTables(); // Refresh table availability
      
      return newReservation;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create reservation';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (id, updateData) => {
    try {
      setLoading(true);
      const response = await reservationAPI.updateReservation(id, updateData);
      const updatedReservation = response.data;
      
      setReservations(prev => 
        prev.map(res => res.id === id ? updatedReservation : res)
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

  const deleteReservation = async (id) => {
    try {
      setLoading(true);
      await reservationAPI.deleteReservation(id);
      
      setReservations(prev => prev.filter(res => res.id !== id));
      await loadTables(); // Refresh table availability
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete reservation';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    reservations,
    tables,
    availableTables,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    loadReservations,
    loadTables,
    loadAllData,
    fetchAvailableTables,
    clearError: () => setError(null),
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};