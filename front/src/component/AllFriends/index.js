import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const defaultProfilePicture =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const AllFriends = ({ token }) => {
  const [allFriends, setAllFriends] = useState([]);
  const navigate = useNavigate()

  const getAllFriends = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friend", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setAllFriends(response.data.friendsList);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, [token]);

  return (
    <div className="all-friend-container">
      {allFriends.map((friend, index) => (
        <div key={index} className="friend-container" onClick={()=>{
          navigate(`/AllFriends/${friend?.user_id}`)
        }}>
          <img
            className="my-friend-img"
            src={friend.profile_picture || defaultProfilePicture}
            alt="friend"
          />
          <span className="friend-username">{friend.username}</span>
        </div>
      ))}
    </div>
  );
};

export default AllFriends;
