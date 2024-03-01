import React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../../icons/homeIcon.svg"
import AllFriends from "../../component/AllFriends";
// import friendIconn from "../../icons/friend-svgrepo-com (2).svg"
import addFriend from "../../icons/addFriend.svg"
import "./style.css"
const Friend = ({ token, userId }) => {
  return (
    <div className="all_page">
      <div className="navbar">
        <Link to="/publicPage" className="linko">
          <img className="icon" src={homeIcon}/>
          Home
        </Link>
        
        <Link to="/FriendRequests" className="linko">
        <img className="icon" src={addFriend} />
          Friend Requests
        </Link>
        <Link to="/Suggestions" className="linko">
        <img className="icon" src={addFriend} />
          Suggestions
        </Link>
        <Link to="/AllFriends" className="linko">
        <img className="icon" src={addFriend} />

          All Friends
        </Link>
      </div>

      <div className="main_page">
        <AllFriends token={token} />
        
      </div>
    </div>
  );
};

export default Friend;
