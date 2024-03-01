import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OnePost = ({ userId, token }) => {
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const [newcomment, setNewComment] = useState("");
  const { itemId } = useParams();
  const handleClick = (e) => {
    setNewComment(e.target.value);
  };
  const addComment = (itemId) => {
    const usernamee = localStorage.getItem("username");
    const user_id = userId;
    axios
      .post("http://localhost:3001/comment", {
        user_id: user_id,
        post_id: itemId,
        comment_text: newcomment,
      })
      .then((response) => {
        console.log(response.data);
        axios
          .post(
            `http://localhost:3001/not`,
            {
              user_id: user_id,
              notification_type: "comment",
              item_id: itemId,
              message: `New comment posted by ${usernamee}`,
            },
            { headers: { authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log(`New comment posted by ${usernamee}`, response.data);

            // getUserById(user_id);
          })
          .catch((error) => {
            console.error("Error creating notification:", error);
          });
        fetchCommentsByPostId(itemId);
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };
  const getPostById = (itemId) => {
    return axios
      .get(`http://localhost:3001/post/one/${itemId}`)
      .then((response) => {
        console.log("Fetched post:", response.data);
        setPost(response.data.post[0]);
        console.log(post);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
        throw error;
      });
  };

  const fetchCommentsByPostId = (itemId) => {
    axios
      .get(`http://localhost:3001/comment/${itemId}`)
      .then((response) => {
        console.log("Fetched comments:", response.data.comments);
        setComment(response.data.comments);
      })
      .catch((error) => {
        console.error("Failed to fetch comments:", error);
      });
  };

  useEffect(() => {
    console.log(post);
  }, [post]);

  useEffect(() => {
    getPostById(itemId);
  }, [itemId]);

  useEffect(() => {
    fetchCommentsByPostId(itemId);
  }, [itemId]);

  return (
    <div>
      {post.content}
      <img src={post.photo} />
      {comment.map((e) => {
        return <div>{e.comment_text}</div>;
      })}
      <input placeholder="write comment" onChange={(e) => handleClick(e)} />
      <button onClick={() => addComment(itemId)}>enter</button>
    </div>
  );
};

export default OnePost;
