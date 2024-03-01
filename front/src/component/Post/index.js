import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";

const Post = () => {
  const [postData, setPostData] = useState({});
  const [refresh, setRefresh] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getPostByUserId = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`http://localhost:3001/post/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      });

      console.log(response.data.posts);
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const handleClick = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    axios
      .post(`http://localhost:3001/post/${userId}`, postData, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response?.data);
        setRefresh((prevRefresh) => !prevRefresh);
        window.dispatchEvent(
          new CustomEvent("OPEN_TOAST", {
            detail: {
              message: `Post Created successfully`,
              mode: "Success",
            },
          })
        );
        setPostData({});
        console.log(refresh);
        getPostByUserId();
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  useEffect(() => {
    getPostByUserId();
  }, [refresh]);

  return (
    <div className="create-profile-post">
      <textarea
        placeholder="write post"
        name="content"
        onChange={handleChange}
      />
      <input
        placeholder="enter url photo"
        name="photo"
        onChange={handleChange}
      />
      <button onClick={handleClick}>post</button>
    </div>
  );
};

export default Post;
