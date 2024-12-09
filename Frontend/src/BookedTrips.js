import {
    CalendarMonth as CalendarIcon,
    Group as GroupIcon,
    LocationOn as LocationIcon,
    TravelExplore as TravelIcon
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from './api';
import PageLayout from './components/PageLayout';

const BookedTrips = () => {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookedTrips = async () => {
      try {
        const response = await axios.get('/api/user-booked-trips/');
        setBookedTrips(response.data.booked_trips);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booked trips:', err);
        setError('Failed to load booked trips');
        setLoading(false);
      }
    };

    fetchBookedTrips();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Booked Trips">
        <Container maxWidth="md" sx={{ 
          mt: 4, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <CircularProgress size={60} thickness={4} />
        </Container>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Booked Trips">
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Booked Trips">
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            mb: 3, 
            textAlign: 'center', 
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          <TravelIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          My Booked Trips
        </Typography>
        
        {bookedTrips.length === 0 ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: 'background.default' 
            }}
          >
            <Typography variant="h6" color="text.secondary">
              You have not booked any trips yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookedTrips.map((trip, index) => (
              <Grid item xs={12} md={6} key={`${trip.trip_id}-${index}`}>
                <Card 
                  elevation={4} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        icon={<TravelIcon />} 
                        label={`Trip #${trip.trip_id}`} 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Typography variant="h6" color="text.secondary">
                        {trip.ship_name}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Start: {new Date(trip.start_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            End: {new Date(trip.end_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Start Port: {trip.start_port}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            End Port: {trip.end_port}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Group Members Section */}
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="subtitle1" 
                        color="text.secondary" 
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <GroupIcon sx={{ mr: 1 }} /> Group Members
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {trip.group_members && trip.group_members.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {trip.group_members.map((member, idx) => (
                            <Chip 
                              key={idx}
                              avatar={<Avatar>{member.fname[0]}</Avatar>}
                              label={`${member.fname} ${member.lname}`}
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          No group members found
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageLayout>
  );
};

export default BookedTrips; 