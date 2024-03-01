
import React, { useState, useEffect } from "react";
import axios from "axios";
import userIcon from "../../icons/userIcon.svg";

const FriendRequests = ({ token, userId }) => {
  const [requests, setRequests] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);
  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/friend/request",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data.incomingFriendRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    // Call the function to fetch friend requests
    getFriendRequests();
  }, [token]);

  const handleConfirmClick = async (friendshipId) => {
    try {
      await axios.put(
        `http://localhost:3001/friend/accept/${friendshipId}`,{},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        }}
      );
      console.log("The friend request was accepted successfully");
      setProcessedItems([...processedItems, friendshipId]);
       } catch (error) {
      console.error("Error accepting friend request: ", error);
    }
  };

  const handleRejectClick = async (friendshipId) => {
    try {
      
      await axios.put(
        `http://localhost:3001/friend/reject/${friendshipId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("The friend request was rejected successfully");
      setProcessedItems([...processedItems, friendshipId]); 
    } catch (error) {
      console.error("Error rejecting friend request: ", error);
    }
  };

  return (
    <div className="users-list-container">
      {requests.map((user, index) => (
        <div className="one-user-container">
          <img
            className="profile-img"
            src={user?.profile_picture || userIcon}
            width="100"
            height="100"
          ></img>
          <div className="username">{user.username}</div>
          <div className="actions-container">
            <button
              className="add"
              onClick={() => handleConfirmClick(user.friendship_id)}
            >
              Confirm
            </button>
            <button
              className="delete"
              onClick={() => handleRejectClick(user.friendship_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
