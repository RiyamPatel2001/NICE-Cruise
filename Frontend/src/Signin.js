import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./styles.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, phone, password } = formData;

    // Password validation rules (same as in your current code)
    const passwordRequirements = [
      {
        test: /.{8,}/,
        message: "Password must be at least 8 characters long.",
      },
      {
        test: /[A-Z]/,
        message: "Password must include at least one uppercase letter.",
      },
      {
        test: /[a-z]/,
        message: "Password must include at least one lowercase letter.",
      },
      {
        test: /[0-9]/,
        message: "Password must include at least one number.",
      },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/,
        message: "Password must include at least one special character.",
      },
    ];

    const failedRequirements = passwordRequirements.filter(
      (requirement) => !requirement.test.test(password)
    );

    if (failedRequirements.length > 0) {
      alert(
        "Password does not meet the following requirements:\n" +
          failedRequirements.map((req) => `- ${req.message}`).join("\n")
      );
      return;
    }

    if (email && phone && password) {
      // Commented out backend call for now
      /*
      try {
        // Send data to backend via Axios POST request
        const response = await axios.post("/api/register", {
          email,
          phone,
          password,
        });

        console.log("User registered successfully:", response.data);
        navigate("/home"); // Redirect after successful registration
      } catch (error) {
        console.error("Error registering user:", error);
        alert("Registration failed. Please try again.");
      }
      */

      // Simulate successful form submission for now
      console.log("Form Data Submitted:", formData);
      navigate("/home"); // Redirect to homepage after submission
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signin-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
