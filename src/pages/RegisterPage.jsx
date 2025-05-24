import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthBrand from '../components/AuthBrand';
import '../pages/RegisterPage.css';  // Import CSS file

const RegisterPage = () => {
  const [businessName, setbusinessName] = useState('');
  const [userName, setuserName] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Registering user:", {
      businessName,
      userName,
      email,
      password
    });
  };

  return (
    <div className="register-container">
      <AuthBrand />

      <div className="register-right">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>

          <label>Business Name</label>
          <input
            type="text"
            placeholder="Enter your business name"
            value={businessName}
            onChange={(e) => setbusinessName(e.target.value)}
            required
          />

          <label>User Name</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
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

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-type your password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Create Account</button>

          <p>Already have an account? <Link to="/">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;