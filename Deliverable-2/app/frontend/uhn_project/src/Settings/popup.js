
import React from "react";
import "./style.css";

const Popup = props => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        <div id="pop-content">{props.content}</div>
        
      </div>
    </div>
  );
};

export default Popup;
