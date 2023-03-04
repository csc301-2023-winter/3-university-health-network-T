import React, { useState } from 'react';
import './Register.css';
import login from '../login.svg';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = () => {
    // Handle register logic here
    console.log('Registering with email:', email, 'and password:', password);
  };

  return (
    <div className="register-container">
      <div className="image">
        <img src={login} />
      </div>
      <h1>Register</h1>
      <form>
        <label>
          Email:
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        </label>
        <br />
        <a href = "/home">
            <button type="button" onClick={handleRegister}>Register</button>
        </a>
      </form>
    </div>
  );
}

export default Register;

