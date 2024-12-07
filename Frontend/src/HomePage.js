import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CruiseCard from "./CruiseCard";
import axios from "./api";
import "./styles.css";

// Add this custom style for the form elements
const filterStyles = {
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
    mb: 3
  },
  formGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    color: '#1a365d',
    fontSize: '1rem',
    fontFamily: "'Montserrat', sans-serif",
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:focus': {
      outline: 'none',
      borderColor: '#0077BE',
      boxShadow: '0 0 0 2px rgba(0, 119, 190, 0.2)',
    }
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    color: '#1a365d',
    fontSize: '1rem',
    fontFamily: "'Montserrat', sans-serif",
    '&:focus': {
      outline: 'none',
      borderColor: '#0077BE',
      boxShadow: '0 0 0 2px rgba(0, 119, 190, 0.2)',
    }
  },
  submitButton: {
    padding: '12px 30px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#0077BE',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Montserrat', sans-serif",
    boxShadow: '0 4px 15px rgba(0, 119, 190, 0.2)',
    '&:hover': {
      backgroundColor: '#005c91',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0, 119, 190, 0.3)',
    }
  }
};

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [departurePort, setDeparturePort] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const params = {
          start_port: departurePort || undefined,
          end_port: arrivalPort || undefined,
          start_date: departureDate || undefined,
        };
        const response = await axios.get("/api/trips/", { params });
        setTrips(response.data);
        console.log(response.data); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Failed to load trips. Please try again later.");
        setLoading(false);
      }
    };

    fetchTrips();
  }, [departurePort, arrivalPort, departureDate]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5">Loading trips...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        pt: 4,
        pb: 6,
        fontFamily: "'Montserrat', sans-serif", // Add default font family
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            align="center"
            sx={{
              color: '#0077BE',
              fontWeight: 700,
              mb: 1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              fontFamily: "'Playfair Display', serif", // Elegant serif font for main title
              letterSpacing: '-0.5px'
            }}
          >
            NICE
          </Typography>
          <Typography 
            variant="h4" 
            align="center"
            sx={{ 
              mb: 4,
              color: '#1a365d',
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '2rem',
              letterSpacing: '0.5px'
            }}
          >
            Select Your Cruise
          </Typography>

          {/* Form Section with enhanced styling - removed onSubmit */}
          <form>
            <Box sx={filterStyles.formRow}>
              <Box sx={filterStyles.formGroup}>
                <Typography 
                  component="label"
                  sx={{ 
                    display: 'block',
                    mb: 1,
                    color: '#1a365d',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  Departure Port
                </Typography>
                <select
                  value={departurePort}
                  onChange={(e) => setDeparturePort(e.target.value)}
                  style={filterStyles.select}
                >
                  <option value="">Any</option>
                  {Array.from(new Set(trips.map((trip) => trip.start_port))).map(
                    (port) => (
                      <option key={port} value={port}>
                        {port}
                      </option>
                    )
                  )}
                </select>
              </Box>

              <Box sx={filterStyles.formGroup}>
                <Typography 
                  component="label"
                  sx={{ 
                    display: 'block',
                    mb: 1,
                    color: '#1a365d',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  Arrival Port
                </Typography>
                <input
                  type="text"
                  placeholder="Search Arrival Port"
                  value={arrivalPort}
                  onChange={(e) => setArrivalPort(e.target.value)}
                  style={filterStyles.input}
                />
              </Box>

              <Box sx={filterStyles.formGroup}>
                <Typography 
                  component="label"
                  sx={{ 
                    display: 'block',
                    mb: 1,
                    color: '#1a365d',
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  Departure Date
                </Typography>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  style={filterStyles.input}
                />
              </Box>
            </Box>
          </form>
        </Paper>

        {/* Cruise Cards Section */}
        <Grid 
          container 
          spacing={3} 
          justifyContent="center"
          sx={{ 
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {trips.map((trip) => (
            <Grid item xs={12} key={trip.trip_id}>
              <CruiseCard
                cruise={trip}
                selectedCruise={selectedCruise}
                setSelectedCruise={setSelectedCruise}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
