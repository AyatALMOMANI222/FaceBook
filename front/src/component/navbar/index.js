import React from "react";
import Notification from "../notification/index";
import Search from "../search";
import MessagesList from "../messagesList";
import facebookIcon from "../../icons/facebook.svg";
import home from "../../icons/home.svg";
import friends from "../../icons/friends.svg";
import users from "../../icons/users.svg";
import profileIcon from "../../icons/profileIcon.svg";
import logout from "../../icons/logout.svg";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import "./style.css";

const Navbar = ({ token, userId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("profile_picture");
    navigate("/");
  };
  return (
    <div className="navbar-container">
      <SVG src={facebookIcon} width={32} height={32} />
      <Search />
      <SVG
        src={profileIcon}
        width={36}
        height={36}
        onClick={() => {
          navigate("/profile");
        }}
      />

      <SVG
        src={home}
        width={32}
        height={32}
        onClick={() => {
          navigate("/publicPage");
        }}
      />
      <SVG
        src={friends}
        width={32}
        height={32}
        onClick={() => {
          navigate("/friend");
        }}
      />
      <SVG
        src={users}
        width={32}
        height={32}
        onClick={() => {
          navigate("/user");
        }}
      />
      <MessagesList token={token} userId={userId} />
      <Notification token={token} userId={userId} />
      <SVG src={logout} width={32} height={32} onClick={handleLogout} />
    </div>
  );
};

export default Navbar;
