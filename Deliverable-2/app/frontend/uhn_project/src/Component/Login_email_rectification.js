import React, { useState } from 'react';
import { AiOutlineQuestion } from "react-icons/ai";
import "./rectify.css";
function Rectify() {
  const [code, setCode] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <div>You are logged in!</div>;
  }

  return (
    <div className="rectify-container">
        <form className="form" onSubmit={handleSubmit}>
            <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <AiOutlineQuestion className="menu-button2" size={38} />
            </div>
            <label className="label">
            Enter the 5-digit code you received in your email:
            <br></br>
            <input type="text" value={code} onChange={(event) => setCode(event.target.value)} />
            </label>
            <button type="submit">Login</button>
        </form>
    </div>
  );
}

export default Rectify;
