import React, { useEffect, useState } from 'react';
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./rectify.css";

function Rectify() {
  const [code, setCode] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/auth', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: localStorage.getItem('email') })
    }).then(response => response.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   const response = await fetch('http://localhost:5000/auth', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ email: localStorage.getItem('email') })
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     // success case
    //     setLoggedIn(true);
    //     navigate('/');
    //   } else {
    //     // failure case
    //     alert(data.message); // or display the error message in some other way
    //   }
    // } catch (error) {
    //   // network error or other error
    //   console.error(error);
    // }
    console.log(code);
    console.log(data.code);
    if (code == data.code) {
      setLoggedIn(true);
      navigate('/home');
    } else {
      alert('The code you enter is uncorrect. Please check the latest email for auth code'); // or display the error message in some other way
    }
  };
  

  const handleHelpClick = () => {
    navigate('/help');
  }

  if (loggedIn) {
    return <div>You are logged in!</div>;
  }

  return (
    <div className="rectify-container">
        <form className="form" onSubmit={handleSubmit}>
            <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <AiOutlineQuestion className="menu-button2" size={38} onClick={handleHelpClick} />
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


