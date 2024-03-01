import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Post from "../Post";
import Modal from "../model";
import SVG from "react-inlinesvg";
import edit from "../../icons/edit.svg";

import "./style.css";
const Profile = ({ token, userId, username }) => {
  const [userInfo, setUserInfo] = useState({});
  const [editInformation, setEditInformation] = useState(false);
  const [info, setInfo] = useState([]);
  const [post, setPost] = useState([]);
  const [postImages, setPostImages] = useState([]);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = (userId) => {
    const {
      username,
      country,
      city,
      date_of_birth,
      profile_picture,
      cover_photo,
      location,
      bio,
    } = userInfo;
    axios
      .put(
        "http://localhost:3001/user/updateUser",
        {
          username,
          country,
          city,
          date_of_birth,
          profile_picture,
          cover_photo,
          location,
          bio,
        },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data);
        setEditInformation(false);
        window.dispatchEvent(
          new CustomEvent("OPEN_TOAST", {
            detail: {
              message: `User updated successfully`,
              mode: "Succses",
            },
          })
        );
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };
  const getInfoByUserId = () => {
    //  const userId=16
    const userId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:3001/user/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInfo(response.data.users[0]);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  const getPostByUserId = () => {
    const userId = localStorage.getItem("userId");

    axios
      .get(`http://localhost:3001/post/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.posts);
        setPost(response.data.posts);
        setPostImages(response?.data?.posts?.map((e, i) => e.photo));
        // const images = post?.map((post,i) => post[i].photo);
        // setPostImages(images);
        // console.log(images);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  useEffect(() => {
    getInfoByUserId();
    getPostByUserId();

    // const images = post?.map((e, i) => e.photo);
    // setPostImages(images);
  }, [userId]);
  useEffect(() => {
    console.log({ postImages });
  }, [postImages]);
  return (
    <div className="profile-page-container">
      <div className="profile-imges-container">
        <img src={info.cover_photo} className="cover-photo" />
        <img src={info.profile_picture} className="profile-photo" />
      </div>
      <div className="details-container-profile">
        <div className="profile-name">{info.username}</div>

        <SVG
          src={edit}
          width={28}
          height={28}
          onClick={() => {
            setEditInformation(!editInformation);
            setIsOpenInfo(true);
          }}
        />
      </div>

      <div className="first-section">
        <div className="user-information-container">
          <div className="info">{info.bio}</div>
          <div className="info">
            live in {info.country},{info.city}
          </div>
          <div className="info">
            Born in {info?.date_of_birth?.split("T")[0]}
          </div>
        </div>
        <div className="profile-post-container">
          <div className="note">what are you thinking about?</div>
          <Post />
        </div>
      </div>

      <Modal
        isModalOpen={isOpenInfo}
        setIsModalOpen={setIsOpenInfo}
        children={
          <div>
            <div className="edit-info-title">Edit Information</div>
            <div className="edit-information">
              <input
                placeholder="username"
                name="username"
                onChange={handleChange}
              />
              <input
                placeholder="country"
                name="country"
                onChange={handleChange}
              />
              <input placeholder="city" name="city" onChange={handleChange} />
              <input
                placeholder="date_of_birth"
                name="date_of_birth"
                onChange={handleChange}
              />
              <input
                placeholder="profile_picture"
                name="profile_picture"
                onChange={handleChange}
              />
              <input
                placeholder="cover_photo"
                name="cover_photo"
                onChange={handleChange}
              />
              <input
                placeholder="location"
                name="location"
                onChange={handleChange}
              />
              <input placeholder="bio" name="bio" onChange={handleChange} />
              <div className="actions-container">
                <button
                  className="edit-infi-btn"
                  onClick={() => handleClick(userId)}
                >
                  EditProfile
                </button>
                <button
                  className="cancel-edit-info"
                  onClick={() => setIsOpenInfo(false)}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        }
      />
      <div className="main-page-container">
        <div className="imges-container">
          {postImages.map((e) => {
            return (
              <div>
                <img alt="img" className="img-one" src={e} />
              </div>
            );
          })}
        </div>
        <div className="post-container">
          <span className="my-posts">My Posts</span>
          {post.map((e, i) => {
            return (
              <div className="map">
                <img className="img-post" src={e.photo} />
                <div>{e.content}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
