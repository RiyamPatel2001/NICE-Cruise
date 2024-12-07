import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api";
import "./styles.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();
  const { email, password, confirm_password } = formData;

  const onChange = (e) =>
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm_password) {
      alert("Passwords do not match");
      return;
    }

    const newUser = { email, password, confirm_password };

    try {
      await axios.post("/api/register/", newUser);
      alert("Registration successful");
      navigate("/signin");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error registering user");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Register</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirm_password"
              value={confirm_password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="signin-button">
            Register
          </button>
        </form>
        <p>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

