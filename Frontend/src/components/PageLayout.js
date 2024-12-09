import {
    ArrowBack as BackIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageLayout = ({ 
  children, 
  title, 
  showBackButton = true, 
  showLogoutButton = true 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);  // Go back to previous page
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/signin');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleBack}
              sx={{ mr: 2 }}
            >
              <BackIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            {title}
          </Typography>
          
          {showLogoutButton && (
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      {children}
    </Box>
  );
};

export default PageLayout; 