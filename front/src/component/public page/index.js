import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { VscChromeClose } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import SVG from "react-inlinesvg";
import like from "../../icons/like-svgrepo-com (1).svg";
import dislike from "../../icons/dislike-svgrepo-com.svg";
import friendIcon from "../../icons/friendIcon.svg";
import profileIcon from "../../icons/profile.svg";
import loginIcon from "../../icons/loginIcon.svg";
import registerIcon from "../../icons/registerIcon.svg";
import userIcon from "../../icons/user-icon.svg";
import photoIcon from "../../icons/photoIcon.svg";
import closeIcon from "../../icons/close-icon.svg";
import commentIcon from "../../icons/commentIcon.svg";
import likeIcon from "../../icons/like-icon.svg";
import loveIcon from "../../icons/loveIcon.svg";
import angryIcon from "../../icons/angryIcon.svg";
import happyIcon from "../../icons/happyIcon.svg";
import Modal from "../model/index";
import "./style.css";

const PublicPage = ({ userId, token }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ content: "", photo: "", feeling: "" });
  const [allpost, setAllpost] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [comment, setComment] = useState("");
  const [commentForPost, setCommentForPost] = useState({});
  const [idpost, setIdpost] = useState(null);
  const [viewComment, setViewComment] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [profilepic, setProfilepic] = useState("");
  const usernamee = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = () => {
    const user_id = userId;
    const { content, photo, feeling } = data;

    axios
      .post(
        "http://localhost:3001/post",
        { user_id, content, photo, feeling },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data);
        window.dispatchEvent(
          new CustomEvent("OPEN_TOAST", {
            detail: {
              message: `New post created by ${usernamee}`,
              mode: "Succses",
            },
          })
        );
        axios
          .post(
            `http://localhost:3001/not`,
            {
              user_id: userId,
              notification_type: "post",
              item_id: response.data.postId,
              message: `New post created by ${usernamee}`,
            },
            { headers: { authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log(`New post created by ${usernamee}`, response.data);
            setNotifications(response.data);
            getUserById(userId);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });

        getAllPost();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const getAllPost = () => {
    axios
      .get("http://localhost:3001/post")
      .then((response) => {
        setAllpost(response?.data?.users);
        console.log({ response });
      })
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  };

  useEffect(() => {
    getAllPost();
  }, [refresh]);

  const deletePostById = async (post_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/post/${post_id}`
      );
      console.log(response.data);
      getAllPost();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = async (post_id, content, photo) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/post/${post_id}`,
        { content, photo },
        { headers: { authorization: `Bearer ${token}` } }
      
      );
      setRefresh((prevRefresh) => !prevRefresh);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const createComments = (post_id, comment) => {
    const usernamee = localStorage.getItem("username");
    const user_id = userId;
    axios
      .post("http://localhost:3001/comment", {
        user_id: user_id,
        post_id: post_id,
        comment_text: comment,
      })
      .then((response) => {
        axios
          .post(
            `http://localhost:3001/not`,
            {
              user_id: user_id,
              notification_type: "comment",
              item_id: post_id,
              message: `New comment posted by ${usernamee}`,
            },
            { headers: { authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log(`New comment posted by ${usernamee}`, response.data);
            setNotifications(response.data);
            getUserById(user_id);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });
        getAllPost();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const addLike = (post_id) => {
    setLikeStatus((prevStatus) => ({
      ...prevStatus,
      [post_id]: { liked: !prevStatus[post_id]?.liked },
    }));

    axios
      .post(
        `http://localhost:3001/like`,
        { userId, post_id },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data);

        axios
          .post(
            `http://localhost:3001/not`,
            {
              user_id: userId,
              notification_type: "like",
              item_id: post_id,
              message: `New like posted by ${usernamee}`,
            },
            { headers: { authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log(`New like posted by ${usernamee}`, response.data);
            setNotifications(response.data);
            getUserById(userId);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });

        // getCommentsByPostId(post_id);
        getAllPost(); // يمكن تحريك هذه الدالة إلى داخل الدالة الأولى getAllPost()
      })
      .catch((error) => {
        console.error("Error adding like:", error);
      });
  };

  const deleteLike = (post_id) => {
    setLikeStatus((prevStatus) => ({
      ...prevStatus,
      [post_id]: { liked: !prevStatus[post_id]?.liked }, // تبديل الحالة بين الإعجاب والديسلايك
    }));
    axios
      .delete(`http://localhost:3001/like/${post_id}`, {
        data: { userId },
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data);
        getAllPost();
      })
      .catch((error) => {
        console.error("Error deleting like:", error);
      });
  };

  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/user/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log("User data:", response.data.users);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  };

  const getComments = () => {
    axios
      .get(`http://localhost:3001/comment`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data?.comments);
        setAllComments(response.data?.comments);
        console.log("Fetched posts by user:", response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts by user:", error);
      });
  };

  const deleteComment = async (comment_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/comment/${comment_id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          data: {
            user_id: userId,
          },
        }
      );
      console.log("Comment deleted:", response.data);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  useEffect(() => {
    getComments();
  }, []);



  return (
    <div className="home-page-container">
      <div className="home-page">
        <div className="side-bar-container">
          <div className="lebles-container profile-section">
            <SVG className="frind-icon icon" src={userIcon} />
            <span className="title">{usernamee}</span>
          </div>
          <div className="lebles-container" onClick={() => navigate("/friend")}>
            <SVG className="frind-icon icon" src={friendIcon} />
            <span className="title">Friends</span>
          </div>
          <div
            className="lebles-container"
            onClick={() => navigate("/profile")}
          >
            <SVG className="frind-icon icon" src={profileIcon} />
            <span className="title">Profile</span>
          </div>
          <div className="lebles-container" onClick={() => navigate("/")}>
            <SVG className="frind-icon icon" src={loginIcon} />
            <span className="title">Login</span>
          </div>
          <div
            className="lebles-container"
            onClick={() => navigate("/register")}
          >
            <SVG className="frind-icon icon" src={registerIcon} />
            <span className="title">Register</span>
          </div>
        </div>

        <div className="post-section-container">
          <div className="post-section">
            <div className="create-post-container">
              <SVG className="frind-icon icon" src={userIcon} />
              
              <input
                placeholder={`What's on your mind, ${usernamee} ?`}
                className="create-post-input"
                onChange={handleChange}
                name="content"
              />
            </div>
            <div className="create-post-container">
              <SVG className="frind-icon icon" src={photoIcon} />
              <input
                placeholder={`Enter image addresse, ${usernamee} ?`}
                className="create-post-input"
                onChange={handleChange}
                name="photo"
              />
            </div>
            <div className="post-btn-container">
              <button className="post-btn" onClick={handleClick}>
                Post
              </button>
            </div>
          </div>

          <div className="display-posts-container">
            <div className="post-container">
              {allpost?.map((item) => {
                let postId = item?.post_id;
                return (
                  <div>
                    <div className="post-head-container">
                      <div className="post-writer">
                        <SVG className="frind-icon icon" src={userIcon} />
                        <span>{item?.username}</span>
                      </div>
                      <div
                        className="close-icon"
                        onClick={() => {
                          deletePostById(item?.post_id);
                          getAllPost();
                        }}
                      >
                        <SVG className="frind-icon icon" src={closeIcon} />
                      </div>
                    </div>

                    <div className="post-content-container">
                     <div>{item?.content}</div> 
                     <img className="image" src={item.photo} />

                    </div>
                    <div className="likes-container">
                      <SVG className="icon like-icon" src={likeIcon} />
                      <SVG className="icon like-icon" src={loveIcon} />
                      <SVG className="icon like-icon" src={angryIcon} />
                      <SVG className="icon like-icon" src={happyIcon} />
                    </div>
                    <div>
                      {allComments
                        ?.filter((e) => e.post_id == item?.post_id)
                        ?.map((e) => {
                          return (
                            <div className="comments-container">
                              <div className="coment-text-container">
                                <SVG
                                  className="frind-icon icon"
                                  src={commentIcon}
                                />
                                <span>{e.comment_text}</span>
                              </div>
                              <SVG
                                className="frind-icon icon"
                                onClick={() => {
                                  deleteComment(e.comment_id);
                                  getComments();
                                }}
                                src={closeIcon}
                              />
                            </div>
                          );
                        })}

                      <div className="create-comments-container">
                        <input
                          className="add-comment-input"
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="e.g comment..."
                        />
                        <butoon
                          className="add-comment-btn"
                          onClick={() => {
                            createComments(item?.post_id, comment);
                            getComments();
                          }}
                        >
                          Add comment
                        </butoon>
                      </div>

                      <div></div>
                    </div>
                    <div className="edit-post-modal">
                      <input
                        className="post-edit"
                        placeholder={`edit your post`}
                        onChange={(e) => {
                          setNewPost(e.target.value);
                        }}
                      />
                      <input
                        className="photo-edit"
                        placeholder={`edit your photo`}
                        onChange={(e) => {
                          setNewPhoto(e.target.value);
                        }}
                      />
                      <button
                        className="add-comment-btn"
                        onClick={() => {
                          console.log({ item });
                          handleUpdatePost(postId, newPost, newPhoto);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="messanger-container"></div>
      </div>
    </div>
  );
};

export default PublicPage;
