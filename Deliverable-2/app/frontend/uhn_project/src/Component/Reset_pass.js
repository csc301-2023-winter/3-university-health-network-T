import React, { useState } from 'react';
import "./reset_password.css";
import uhn_logo from "../uhn_logo.svg";
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');


  const handleHelpClick = () => {
    navigate('/help');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/account/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        setSubmitted(true);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };
  

  if (submitted) {
    return <div>Check your email to reset your password.</div>;
  }

  return (
    <div className='forgot-password-container'>
      <div style={{ position: 'absolute', top: '0', left: '0' }}>
        <AiOutlineQuestion className="menu-button2" size={38} onClick={handleHelpClick} />
      </div>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <label className='forgot-password-label'>
          Enter your email address:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className='forgot-password-label'>
          Enter your new password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button className='forgot-password-button' type="submit">Reset Password</button>
      </form>
    </div>
  );
  
}

export default ForgotPassword;



