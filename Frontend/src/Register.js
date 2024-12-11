import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./api";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirm_password: null,
  });

  const navigate = useNavigate();
  const { email, password, confirm_password } = formData;

  const validatePassword = (password) => {
    let errors = [];

    if (password.length < 8) {
      errors.push("At least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("One uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("One lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("One digit.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("One special character (!@#$%^&*(),.?\":{}|<>).");
    }
    
    return errors;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Client-side password validation
    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordErrors.length > 0 ? passwordErrors.join(' ') : null,
      }));
    }
    // Validate confirm password
    else if (name === 'confirm_password') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_password: value !== formData.password ? "Passwords do not match" : null,
      }));
    } else {
      // Clear specific field errors when user starts typing
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      email: null,
      password: null,
      confirm_password: null,
    });

    // Client-side validation before submission
    if (password !== confirm_password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirm_password: "Passwords do not match",
      }));
      return;
    }

    const newUser = { email, password, confirm_password };

    try {
      await axios.post("/api/register/", newUser);
      const loginResponse = await axios.post("/api/login/", {
        username: email,
        password: password,
      });
      const token = loginResponse.data.token;
      localStorage.setItem('token', token);
      alert("Registration successful");
      navigate("/home");
    } catch (err) {
      // Handle backend validation errors
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;

        // Map backend errors to the errors state
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...backendErrors,
        }));
      } else {
        console.error(err.response?.data || err.message);
        alert("Error registering user");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/background1.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.25)', // More transparent
            backdropFilter: 'blur(8px)',  // Subtle blur
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle border
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Softer shadow
            '& .MuiInputBase-root': { // Make input fields semi-transparent
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            },
            '& .MuiInputLabel-root': { // Ensure labels are visible
              color: 'rgba(0, 0, 0, 0.7)',
            },
            '& .MuiOutlinedInput-root': { // Style input borders
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            },
          }}
        >
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <PersonAddIcon 
                sx={{ 
                  fontSize: 40, 
                  color: '#1976d2',
                  mb: 1 
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1"
                sx={{ 
                  fontWeight: 600,
                  color: '#1976d2'
                }}
              >
                Register
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={onChange}
              required
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={confirm_password}
              onChange={onChange}
              required
              variant="outlined"
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Register
            </Button>

            <Typography 
              variant="body1" 
              align="center"
              sx={{ mt: 2 }}
            >
              Already have an account?{' '}
              <Link 
                to="/signin"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;

