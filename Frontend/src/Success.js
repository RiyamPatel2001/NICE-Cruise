import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const SuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { totalCost, guests, selectedCruise, trip_id } = state || {};

  if (!state || !totalCost || !selectedCruise || !guests || guests.length === 0) {
    return <div>Error: Missing required information.</div>;
  }

  return (
    <Container className="success-container">
      <Paper elevation={3} sx={{ p: 3, my: 4, backgroundColor: 'transparent' }}>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 5,
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          position: 'relative'
        }}
      >
        <CheckCircleIcon 
          sx={{ 
            fontSize: 80,
            color: '#2e7d32',
            mb: 2,
            filter: 'drop-shadow(0 2px 4px rgba(46, 125, 50, 0.2))'
          }} 
        />
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            color: '#2e7d32',
            fontWeight: 600,
            letterSpacing: '-0.5px',
            mb: 1,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Booking Confirmed
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#666',
            fontSize: '1.1rem',
            bgcolor: '#f5f5f5',
            py: 0.5,
            px: 2,
            borderRadius: '20px',
            display: 'inline-block'
          }}
        >
          Trip ID: <strong style={{ color: '#1976d2' }}>{trip_id}</strong>
        </Typography>
      </Box>

        {/* Cruise Information */}
        <Box className="cruise-info" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 2 }}>
            Cruise Details
          </Typography>
          <Typography><strong>Destination:</strong> {selectedCruise.end_port}</Typography>
          <Typography><strong>Departure Port:</strong> {selectedCruise.start_port}</Typography>
          <Typography><strong>Departure Date:</strong> {formatDate(selectedCruise.start_date)}</Typography>
          <Typography><strong>Return Date:</strong> {formatDate(selectedCruise.end_date)}</Typography>
        </Box>

        {/* Guests Information */}
        <Box className="guests-info" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 2 }}>
            Guest Details
          </Typography>
          {guests.map((guest, index) => {
            const age = calculateAge(guest.dob);
            return (
              <Paper 
                key={index} 
                className="guest-card"
                sx={{ 
                  p: 2, 
                  mb: 2,
                  backgroundColor: '#e3f2fd',
                  borderLeft: '4px solid #1976d2'
                }}
              >
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
                  Guest {index + 1} - Room {guest.roomNumber}
                </Typography>
                <Typography><strong>Name:</strong> {guest.firstName} {guest.lastName}</Typography>
                <Typography><strong>Gender:</strong> {guest.gender}</Typography>
                <Typography><strong>Age:</strong> {age}</Typography>
                <Typography><strong>Nationality:</strong> {guest.country}</Typography>
                <Typography><strong>Email:</strong> {guest.email || "N/A"}</Typography>
                <Typography><strong>Phone:</strong> {guest.phone}</Typography>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {guest.addressLine1
                    ? `${guest.addressLine1}, ${guest.city}, ${guest.state}, ${guest.zipCode}, ${guest.country}`
                    : "Address not available"}
                </Typography>
              </Paper>
            );
          })}
        </Box>

        {/* Total Cost */}
        <Box className="total-cost" sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ borderBottom: '2px solid #1976d2', pb: 1, mb: 2 }}>
            Total Cost
          </Typography>
          <Typography variant="h4" sx={{ color: '#d32f2f' }}>
            ${totalCost.toFixed(2)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button 
            variant="contained" 
            onClick={() => window.print()}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Print Confirmation
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/home')}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Return to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default SuccessPage;
