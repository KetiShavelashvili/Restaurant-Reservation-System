import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const API_URL = 'http://localhost:5000/api/auth';

const Login = () => {
  const location = useLocation();
  const isAdminRegistering = location.state?.adminRegistering || false;
  
  const [isLogin, setIsLogin] = useState(!isAdminRegistering);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // If admin is registering a user, don't login, just go back to admin page
      if (isAdminRegistering) {
        alert('✅ User registered successfully!');
        navigate('/admin');
        return;
      }

      // Store token and user data
      login({ ...data.user, token: data.token });

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'staff') {
        navigate('/reservations');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = () => {
    if (isAdminRegistering) {
      // If admin is registering, go back to admin page
      navigate('/admin');
    } else {
      setIsLogin(!isLogin);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>
          {isAdminRegistering ? 'Register New User' : (isLogin ? 'Login' : 'Sign Up')}
        </h2>
        
        {isAdminRegistering && (
          <div className="admin-notice" style={{
            background: '#e3f2fd',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center',
            color: '#1976d2'
          }}>
            <p>👨‍💼 Admin: Registering a new user</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {!isLogin && isAdminRegistering && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : (isAdminRegistering ? 'Register User' : 'Sign Up'))}
          </button>
        </form>
        
        <p className="toggle-text">
          {isAdminRegistering ? (
            <>
              <span onClick={handleToggle} className="toggle-link">
                Back to Admin Dashboard
              </span>
            </>
          ) : (
            <>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={handleToggle} className="toggle-link">
                {isLogin ? 'Sign Up' : 'Login'}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;