import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCalendarPlus, FaList, FaUserCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>🍽️ Gourmet Reserve</h1>
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/reserve" className="nav-link">
            <FaCalendarPlus className="nav-icon" /> New Reservation
          </Link>
          <Link to="/reservations" className="nav-link">
            <FaList className="nav-icon" /> All Reservations
          </Link>
          <Link to="/admin" className="nav-link">
            <FaUserCog className="nav-icon" /> Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;