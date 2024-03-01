import React, { useState, useEffect } from "react";
import axios from "axios";
import userIcon from "../../icons/userIcon.svg";
import { useNavigate } from "react-router-dom";
import "./style.css";

const User = ({ userId, token }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/user");
        setUsers(response.data.users);
        console.log(response.data);
      } catch (error) {
        console.error("Error getting users:", error);
      }
    };

    fetchUsers();
  }, []);
  const addFriend = (friend_id) => {
    axios
      .post(
        `http://localhost:3001/friend`,
        { userId, friend_id },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data);
        window.dispatchEvent(
          new CustomEvent("OPEN_TOAST", {
            detail: {
              message: `Friend request sent successfully`,
              mode: "Succses",
            },
          })
        );
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        console.log(error.response);
        window.dispatchEvent(
          new CustomEvent("OPEN_TOAST", {
            detail: {
              message: `Friendship request already sent`,
              mode: "Error",
            },
          })
        );
      });
  };

  const acceptFriendRequest = (friendship_id, token) => {
    axios
      .put(
        `http://localhost:3001/friend/accept/17${friendship_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        // Handle success response here
      })
      .catch((error) => {
        console.error("Error accepting friend request:", error);
        // Handle error here
      });
  };

  const handleUserClick = (userId) => {
    navigate(`/friendProfile/${userId}`);
  };

  return (
    <div className="users-list-container">
      {users.map((user, index) => (
        <div key={index}>
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
                onClick={() => {
                  addFriend(user?.user_id);
                }}
              >
                Add Friend
              </button>
              <button className="delete">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default User;
