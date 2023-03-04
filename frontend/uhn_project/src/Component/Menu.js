import React, { useState } from 'react';
import './Menu.css';
import { AiOutlineQuestion } from "react-icons/ai";

function Menu() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleCloseClick = () => {
    setShowMenu(false);
  };

  return (
    <div className="menu">
      <div className="buttons-container">
        <button className="menu-button" onClick={handleMenuClick}>
          Menu
        </button>
        <AiOutlineQuestion className="menu-button2" size={38} />
      </div>
      
      {showMenu && (
        <div className="menu-overlay">
          <ul className="menu-list">
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="#">Rehab Program</a>
            </li>
            <li>
              <a href="#">Meeting</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Settings</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li>
            <li>
              <a href="#">Contact us</a>
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



