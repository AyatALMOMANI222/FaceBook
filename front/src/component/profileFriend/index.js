import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Live from "../../icons/live.svg";
import Location from "../../icons/location.svg";
import SVG from "react-inlinesvg";

import "./style.css";

const ProfileFriend = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/user/${userId}`);
      setUser(response?.data?.users[0]);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };
  const getPostsByUserId = () => {
    axios
      .get(`http://localhost:3001/post/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log(response.data.posts);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };
  const getAllFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/friend/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFriends(response?.data?.friendsList);
      console.log(response?.data?.friendsList);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  useEffect(() => {
    fetchUserById();
    getPostsByUserId();
    getAllFriends();
  }, [userId]);

  return (
    <div className="profile-friend-container">
      <div className="cover-img-container">
        <img className="cover-img" src={user?.cover_photo} />
        <img className="prof-img" src={user?.profile_picture} />
      </div>
      <div className="user-info-container">
        <span className="username">{user?.username}</span>
        <span className="bio">{user?.bio}</span>
      </div>
      <div className="profile-friend-main">
        <div className="left-section">
          <div className="intro-container">
            <span className="title">Intro</span>
            <div className="country">
              <SVG src={Live} width={26} height={26} />
              <span className="contant">
                Lives in
                <span className="bold"> {user?.city}</span>
              </span>
            </div>
            <div className="country">
              <SVG src={Location} width={26} height={26} />
              <span className="contant">
                From
                <span className="bold">{user?.country}</span>
              </span>
            </div>
          </div>
          <div className="friends-title">Freinds</div>
          <div className="user-friends-container">
            {friends?.map((friend) => {
              return (
                <div
                  className="one-friend"
                  onClick={() => {
                    navigate(`/AllFriends/${friend?.user_id}`);
                  }}
                >
                  <img className="frinds-img" src={friend?.profile_picture} />
                  <div className="username">{friend?.username}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="right-section">
          <div className="posts-title">Posts</div>
          {posts?.map((item, index) => {
            return (
              <div key={index} className="post-container">
                <div className="user-info">
                  <img className="p-img" src={user?.profile_picture} />
                  <span className="username">{user?.username}</span>
                </div>
                <div className="post-content">{item?.content}</div>
                <img className="post-img" src={item?.photo} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileFriend;
