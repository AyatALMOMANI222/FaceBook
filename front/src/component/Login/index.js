import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";
const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = () => {
    const { email, password } = loginData;
    axios
      .post("http://localhost:3001/login", loginData)
      .then((response) => {
        console.log(response?.data);
        localStorage.setItem("token", response?.data.userToken);
        localStorage.setItem("userId", response?.data.user_id);
        localStorage.setItem("username", response?.data.username);
        localStorage.setItem("profile_picture", response?.data.profile_picture);
        navigate("/publicPage");
      })
      .catch((error) => {
        console.error("Error Login:", error);
      });
    console.log(email, password);
  };
  return (
    <div className="login-page-container">
      <div className="login-page">
        <h1>Login</h1>
        <input
          className="email"
          placeholder="email"
          onChange={handleChange}
          name="email"
        />
        <input
          className="password"
          placeholder="password"
          onChange={handleChange}
          name="password"
        />
        <div className="register-btn-container">
          <button
            className="register_btn"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
        <button className="login-btn" onClick={handleClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
