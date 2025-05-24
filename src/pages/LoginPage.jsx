import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthBrand from '../pages/AuthBrand';
import '../components/LoginPage.css';  // Import your CSS

const LoginPage = () => {
  // handles hooks for storing input values
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with: ', { username, password });
  };

  return (
    <div className="login-container">
      <AuthBrand />

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>SIGN IN</h2>

          <label>User Name</label>
          <input
            type="text"
            placeholder="Enter UserName"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>

          <p>
            Don't have an account? <Link to="/register">Register</Link>
            <Link to="/settings">Settings</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;