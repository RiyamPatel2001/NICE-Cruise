import LoginIcon from '@mui/icons-material/Login';
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
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            '& .MuiInputBase-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 0, 0, 0.7)',
            },
            '& .MuiOutlinedInput-root': {
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
              <LoginIcon 
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
                Sign In
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Username or Email"
              name="username_or_email"
              value={username_or_email}
              onChange={onChange}
              required
              variant="outlined"
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
              Sign In
            </Button>

            <Typography 
              variant="body1" 
              align="center"
              sx={{ mt: 2 }}
            >
              Don't have an account?{' '}
              <Link 
                to="/register"
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;

