import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { username, email, password } = userData;
    console.log({ username, email, password });
    axios
      .post("http://localhost:3001/user", userData)
      .then((response) => {
        console.log(response?.data);
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
    console.log(userData);
  };

  return (
    <div className="register-page-container">
      <div className="register-page">
        <h1>Register</h1>
        <input
          className="user-name"
          placeholder="username"
          name="username"
          type="text"
          onChange={handleChange}
        />
        <input
          className="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          className="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <div className="login-cont">
          <span
            onClick={() => {
              navigate("/");
            }}
            className="login-btn"
          >
            login
          </span>
        </div>
        <button className="register-btn" onClick={handleSubmit}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
