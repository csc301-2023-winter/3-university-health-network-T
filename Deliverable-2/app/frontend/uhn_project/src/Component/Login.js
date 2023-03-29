import React, { useState } from 'react';
import './Login.css';
import uhn_logo from "../uhn_logo.png";
import { AiOutlineQuestion } from "react-icons/ai";
import './Menu.css';
import { useNavigate } from "react-router-dom";
import Menu from './Menu';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    fetch('http://localhost:5000/account/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.token){
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        navigate('/rectify');
      }
       else {
        // Login failed
        console.log(data.message);
        setErrorMessage('The email and password you entered do not match.');
      }
    })
    .catch(error => {
      console.error(error);
    });
  };

  const handleRegister = () => {
  
    navigate("/register");
    console.log('Registering with email:', email, 'and password:', password);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password for email:', email);
  };

  const handleHelpClick = () => {
    navigate('/help');
  }

  return (
    <div id='large_container'>
       <Menu/>
      <div className="login-container">
      
      
      
       
      <form>
        
        <div className="logo-container">
        <img src={uhn_logo} alt="Login" />
      </div>
      
        <h1>Login</h1>
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
        <button className="buttons" type="button" onClick={handleLogin}>Login</button>
       
            <button className="buttons" type="button" onClick={handleRegister}>Register</button>
        
        <a href="/reset" onClick={handleForgotPassword}>Forgot Password?</a>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div></div>
    
    
  );
}

export default Login;






