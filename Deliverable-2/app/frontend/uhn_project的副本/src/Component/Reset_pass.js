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

  const handleHelpClick = () => {
    navigate('/help');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        setSubmitted(true);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login'); 
      } else {
        setError('Email address not found.');
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
        <div style={{ width: '500px', height: '500px' ,marginRight: '20px'}}>
            <img src={uhn_logo} alt="Login" style={{ width: '100%', height: '100%' }}/>
        </div>
        <div style={{ position: 'absolute', top: '0', left: '0' }}>
            <AiOutlineQuestion className="menu-button2" size={38} onClick = {handleHelpClick}/>
        </div>
        <form className="forgot-password-form" onSubmit={handleSubmit}>
        <label className='forgot-password-label'>
            Enter your email address:
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        {error && <div className="error">{error}</div>}
        <button className='forgot-password-button' type="submit">Reset Password</button>
        </form>
    </div>
  );
}

export default ForgotPassword;



