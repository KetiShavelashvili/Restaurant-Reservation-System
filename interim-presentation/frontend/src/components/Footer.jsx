import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, 
  FaFacebookF, FaInstagram, FaTwitter, FaUtensils 
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Contact Information */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>123 Gourmet Street, Food District</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>(123) 456-7890</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>reservations@tablereserve.com</span>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="footer-section">
          <h4>Opening Hours</h4>
          <div className="hours-info">
            <div className="hours-item">
              <FaClock />
              <div>
                <strong>Monday - Friday</strong>
                <span>5:00 PM - 11:00 PM</span>
              </div>
            </div>
            <div className="hours-item">
              <FaClock />
              <div>
                <strong>Saturday - Sunday</strong>
                <span>12:00 PM - 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/reserve">Make Reservation</Link>
            <Link to="/reservations">View Reservations</Link>
            <Link to="/login">Login</Link>
          </nav>
        </div>

        {/* Reservation Policy */}
        <div className="footer-section">
          <h4>Reservation Policy</h4>
          <ul className="policy-list">
            <li>Reservations up to 60 days in advance</li>
            <li>Arrive 15 minutes early</li>
            <li>Cancel 2+ hours in advance</li>
            <li>Smart casual dress code</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {currentYear} Table Reserve. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <span>•</span>
          <a href="#terms">Terms of Service</a>
          <span>•</span>
          <a href="#accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;