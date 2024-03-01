import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import friendIcon from "../../icons/friendIcon.svg";
import profileIcon from "../../icons/profile.svg";
import loginIcon from "../../icons/loginIcon.svg";
import registerIcon from "../../icons/registerIcon.svg";
import userIcon from "../../icons/user-icon.svg";

import "./style.css";

const SideBar = () => {
  const navigate = useNavigate();
  return (
    <div className="side-bar-container">
      <div className="lebles-container profile-section">
        <SVG className="frind-icon icon" src={userIcon} />
        <span className="title">{usernamee}</span>
      </div>
      <div className="lebles-container" onClick={() => navigate("/friend")}>
        <SVG className="frind-icon icon" src={friendIcon} />
        <span className="title">Friends</span>
      </div>
      <div className="lebles-container" onClick={() => navigate("/profile")}>
        <SVG className="frind-icon icon" src={profileIcon} />
        <span className="title">Profile</span>
      </div>
      <div className="lebles-container" onClick={() => navigate("/")}>
        <SVG className="frind-icon icon" src={loginIcon} />
        <span className="title">Login</span>
      </div>
      <div className="lebles-container" onClick={() => navigate("/register")}>
        <SVG className="frind-icon icon" src={registerIcon} />
        <span className="title">Register</span>
      </div>
    </div>
  );
};

export default SideBar;
