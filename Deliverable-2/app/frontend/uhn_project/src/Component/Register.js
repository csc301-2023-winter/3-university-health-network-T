import React, { useState } from 'react';
import './Register.css';
import uhn_logo from "../uhn_logo.svg";
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleHelpClick = () => {
    navigate('/help');
  }

  const handleGoBack = () => {
    navigate('/');
  };
  

  const handleRegister = (event) => {
    event.preventDefault();

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    fetch('http://localhost:5000/account/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Signup successful') {
        // Register successful
        console.log("Register successful");
        navigate('/'); 
      } else {
        // Register failed
        console.log(data.message);
        setErrorMessage(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      setErrorMessage('Something went wrong.');
    });
  };

  return (
    <div className="register-container">
      <div className="logo-container">
        <img src={uhn_logo} alt="Login" className="uhn-logo" />
      </div>
      <div className="help-icon">
        <AiOutlineQuestion className="menu-button2" size={38} onClick={handleHelpClick} />
      </div>
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <label>
          Email:
          <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <label>
          Confirm Password:
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
        </label>
        <button type="submit">Register</button>
        <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Register;

