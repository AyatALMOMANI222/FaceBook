import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const SearchView = () => {
  const { term } = useParams();
  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);

  console.log(term);
  const handleSubmit = async (e) => {
    try {
      const response = await axios.get(`http://localhost:3001/search/${term}`);
      console.log( response.data);
      const { users, posts } = response.data;
      setUser(users);
      setPost(posts);
      console.log(users, posts);
    } catch (error) {
      console.error("Error getting search results:", error);
    }
  };
  useEffect(() => {
    handleSubmit();
  }, [term]);

  return (
    <div>
      <div>
        {user.map((e) => {
          return <div>{e.username}</div>;
        })}
      </div>
      <div>
        {post.map((e) => {
          return <div>{e.content}</div>;
        })}
      </div>
    </div>
  );
};

export default SearchView;
