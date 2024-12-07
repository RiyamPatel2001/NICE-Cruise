import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimerIcon from '@mui/icons-material/Timer';
import {
  Box,
  CardContent,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import React from "react";
import { useNavigate } from 'react-router-dom';

const CruiseCard = ({
  cruise,
  selectedCruise,
  setSelectedCruise,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      onClick={() => {
        setSelectedCruise(cruise);
        navigate("/total-cost", {
          state: { selectedCruise: cruise, cruisePrice: cruise.price },
        });
      }}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: selectedCruise?.trip_id === cruise.trip_id 
          ? '2px solid rgba(0, 119, 190, 0.6)'
          : '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
          '& .shine': {
            transform: 'translateX(100%)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0077BE, #00A3FF)',
          opacity: selectedCruise?.trip_id === cruise.trip_id ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }
      }}
    >
      {/* Shine effect overlay */}
      <Box
        className="shine"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <DirectionsBoatIcon 
            sx={{ 
              fontSize: 32, 
              color: '#0077BE',
              mr: 1.5,
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
            }} 
          />
          <Typography 
            variant="h5" 
            component="h3"
            sx={{
              color: '#0077BE',
              fontWeight: 700,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: '0.5px',
              flex: 1
            }}
          >
            {cruise.ship_name}
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(0, 119, 190, 0.1)',
              border: '1px solid rgba(0, 119, 190, 0.2)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <TimerIcon 
              sx={{ 
                fontSize: 20,
                color: '#0077BE',
                mr: 0.5,
                filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.1))'
              }} 
            />
            <Typography 
              variant="body2"
              sx={{
                color: '#0077BE',
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {Math.ceil((new Date(cruise.end_date) - new Date(cruise.start_date)) / (1000 * 60 * 60 * 24))} Days
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ 
          my: 2, 
          opacity: 0.2,
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)'
        }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <LocationOnIcon sx={{ 
              color: '#0077BE', 
              mr: 1.5,
              mt: 0.5,
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))'
            }} />
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontWeight: 600,
                  mb: 0.5,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Route
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500
                }}
              >
                {cruise.start_port} → {cruise.end_port}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CalendarTodayIcon sx={{ 
              color: '#0077BE', 
              mr: 1.5,
              mt: 0.5,
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))'
            }} />
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontWeight: 600,
                  mb: 0.5,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Duration
              </Typography>
              <Typography 
                variant="body1"
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500
                }}
              >
                {new Date(cruise.start_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })} - {new Date(cruise.end_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Paper>
  );
};

export default CruiseCard;
