import React, { useState } from 'react';
import './Menu.css';
import { AiOutlineQuestion } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleCloseClick = () => {
    setShowMenu(false);
  };

  const handleHelpClick = () => {
    navigate('/help');
  }

  return (
    <div className="menu">
      <div className="buttons-container">
        <button className="menu-button" onClick={handleMenuClick}>
          Menu
        </button>
        <AiOutlineQuestion className="menu-button2" size={38} onClick = {handleHelpClick}/>
      </div>
      
      {showMenu && (
        <div className="menu-overlay">
          <ul className="menu-list">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/rehab">Rehab Program</a>
            </li>
            <li>
              <a href="/video">Avatar</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              <a href="/help">Help</a>
            </li>
            <li>
              <a href="/contact">Contact us</a>
            </li>
            <li>
              <a href="/">Login</a>
            </li>
          </ul>
          <button className="menu-close" onClick={handleCloseClick}>
            &#x2716;
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;



