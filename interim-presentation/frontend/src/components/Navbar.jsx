import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCalendarPlus, FaList, FaUserCog, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>🍽️ Table Reserve</h1>
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>
          
          {user && (
            <>
              <Link to="/reserve" className="nav-link">
                <FaCalendarPlus className="nav-icon" /> New Reservation
              </Link>
              
              {!isAdmin && !isStaff && (
                <Link to="/my-reservations" className="nav-link">
                  <FaList className="nav-icon" /> My Reservations
                </Link>
              )}
              
              {(isAdmin || isStaff) && (
                <Link to="/reservations" className="nav-link">
                  <FaList className="nav-icon" /> All Reservations
                </Link>
              )}
            </>
          )}
          
          {isAdmin && (
            <Link to="/admin" className="nav-link">
              <FaUserCog className="nav-icon" /> Admin
            </Link>
          )}
          
          {isStaff && (
            <Link to="/staff" className="nav-link">
              <FaUserCog className="nav-icon" /> Staff Panel
            </Link>
          )}
          
          {!user ? (
            <Link to="/login" className="nav-link">
              <FaSignInAlt className="nav-icon" /> Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="nav-link logout-btn">
              <FaSignOutAlt className="nav-icon" /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;