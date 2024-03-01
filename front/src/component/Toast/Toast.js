import React from "react";
import SVG from "react-inlinesvg";
import succses from "../../icons/success.svg";
import "./style.css";
function Toast({ open, message, mode }) {
  return (
    <div className={`toast-container ${open && "active"} mode-${mode}`}>
      <div className="icons-container">
        <SVG
          className="messages-list-icon"
          src={succses}
          height={26}
          width={26}
          fill={mode == "Succses" ? "#4ab701" : "red"}
        />
        <span className={mode}>{mode}</span>
      </div>
      <div className="message">{message}</div>
      <div className={`progress  ${open && "active"} ${mode}`}></div>
    </div>
  );
}

export default Toast;
