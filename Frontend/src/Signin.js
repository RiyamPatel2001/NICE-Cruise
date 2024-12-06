import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api";
import "./styles.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { username_or_email, password } = formData;

  const onChange = (e) =>
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username_or_email,
      password,
    };

    try {
      const res = await axios.post("/api/login/", loginData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("email", res.data.email);

      alert("Login successful");
      navigate("/home");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error logging in");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Username or Email:</label>
            <input
              type="text"
              name="username_or_email"
              value={username_or_email}
              onChange={onChange}
              required
              placeholder="Enter your username or email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

