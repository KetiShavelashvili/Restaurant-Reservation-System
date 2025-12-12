import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaClock, FaUsers, FaStar, FaUtensils, FaCheckCircle } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Table Reserve</h1>
          <p className="hero-subtitle">
            Experience fine dining with our easy-to-use reservation system. 
            Book your perfect table in just a few clicks.
          </p>
          <div className="hero-buttons">
            <Link to="/reserve" className="btn-primary btn-hero">
              Book a Table Now
            </Link>
            <Link to="/reservations" className="btn-secondary">
              View Reservations
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="restaurant-illustration">
            <div className="table-illustration"></div>
            <div className="table-illustration"></div>
            <div className="table-illustration"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">Experience the best in restaurant reservation management</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaCalendarCheck />
            </div>
            <h3>Easy Booking</h3>
            <p>Reserve your table in just a few clicks with our intuitive interface</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3>Real-time Availability</h3>
            <p>See available tables in real-time with instant confirmation</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Group Bookings</h3>
            <p>Perfect for parties of all sizes, from intimate dinners to large gatherings</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaStar />
            </div>
            <h3>Premium Experience</h3>
            <p>Enjoy special requests, dietary accommodations, and personalized service</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <FaUtensils className="step-icon" />
            <h3>Choose Date & Time</h3>
            <p>Select your preferred dining date and time slot</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step">
            <div className="step-number">2</div>
            <FaUsers className="step-icon" />
            <h3>Select Party Size</h3>
            <p>Tell us how many people will be joining</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step">
            <div className="step-number">3</div>
            <FaCalendarCheck className="step-icon" />
            <h3>Fill Details</h3>
            <p>Enter your contact information and special requests</p>
          </div>
          
          <div className="step-connector"></div>
          
          <div className="step">
            <div className="step-number">4</div>
            <FaCheckCircle className="step-icon" />
            <h3>Confirm Booking</h3>
            <p>Review and confirm your reservation instantly</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>150+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-card">
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
        <div className="stat-card">
          <h3>24/7</h3>
          <p>Online Booking</p>
        </div>
        <div className="stat-card">
          <h3>50+</h3>
          <p>Tables Available</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Dine With Us?</h2>
        <p>Book your table now and experience exceptional dining</p>
        <Link to="/reserve" className="btn-primary btn-cta">
          Reserve Your Table
        </Link>
      </div>
    </div>
  );
};

export default HomePage;