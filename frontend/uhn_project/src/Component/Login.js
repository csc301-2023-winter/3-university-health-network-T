import React, { useState } from 'react';
import './Login.css';
import login from '../login.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    // Handle login logic here
    console.log('Logging in with email:', email, 'and password:', password);
  };

  const handleRegister = () => {
    // Handle register logic here
    console.log('Registering with email:', email, 'and password:', password);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log('Forgot password for email:', email);
  };

  return (
    <div className="login-container">
      <div className="image">
        <img src={login} />
      </div>
      <h1>Login</h1>
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
        <button type="button" onClick={handleLogin}>Login</button>
        <a href="/register">
            <button type="button" onClick={handleRegister}>Register</button>
        </a>
      </form>
      <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
    </div>
  );
}

export default Login;




