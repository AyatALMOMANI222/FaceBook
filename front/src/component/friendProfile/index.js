import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FriendProfile = ({ token }) => {
  const [user, setUser] = useState([]);
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [commentPost, setCommentPost] = useState([]);
  const [data, setData] = useState({ content: "", photo: "" });
  const [showComments, setShowComments] = useState(false);

  const usernamee = localStorage.getItem("username");
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const fetchUserById = () => {
    axios
      .get(`http://localhost:3001/user/${userId}`)
      .then((response) => {
        console.log("Fetched user data:", response.data.users[0]);
        setUser(response.data.users);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = (data) => {
    const userId = localStorage.getItem("userId");
    const { content, photo } = data;
    console.log(data, userId);
    axios
      .post(
        "http://localhost:3001/post",
        { userId, content, photo },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data);
        // setPostData(response?.data);
        // window.dispatchEvent(new Event("OPEN_TOAST"));
        if (response) {
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
            })
            .catch((error) => {
              console.error("Error creating notification:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const handleCommentClick = (comment, postId) => {
    const userId = localStorage.getItem("userId");
    axios
      .post(
        "http://localhost:3001/comment",
        { user_id: userId, post_id: postId, comment_text: comment },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("Comment created successfully:", response.data);
        const newComment = {
          comment_id: response.data.comment_id,
          user_id: userId,
          post_id: postId,
          comment_text: comment,
        };
        setCommentPost((prevComments) => [
          ...prevComments.filter((comment) => comment.post_id !== postId),
          newComment,
        ]);
      })
      .catch((error) => {
        console.error("Failed to create comment:", error);
      });
  };

  useEffect(() => {
    fetchUserById();
  }, [userId]);

  const fetchPostsByUserId = () => {
    axios
      .get(`http://localhost:3001/post/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched posts by user:", response.data.posts);
        setPosts(response.data.posts);
        console.log(posts);
      })
      .catch((error) => {
        console.error("Failed to fetch posts by user:", error);
      });
  };

  useEffect(() => {
    fetchPostsByUserId();
  }, [posts]);

  return (
    <div>
      {user.map((e) => {
        return (
          <div>
            <img src={e.cover_photo} />
            <img src={e.profile_picture} />
            <div>{e.username}</div>
            <div>
              <div>{e.bio}</div>
              <div>born in {e.date_of_birth.split("T")[0]}</div>
              <div>
                {" "}
                live in {e.country},{e.city}
              </div>
            </div>
            <input
              placeholder="write post"
              name="content"
              onChange={handleChange}
            />
            <input
              placeholder="enter url photo"
              name="photo"
              onChange={handleChange}
            />
            <button
              onClick={() => {
                handleClick(data);
              }}
            >
              post
            </button>

            {posts.map((e) => {
              return (
                <div>
                  <div>{e.content}</div>
                  <img src={e.photo} alt="photo" />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FriendProfile;
