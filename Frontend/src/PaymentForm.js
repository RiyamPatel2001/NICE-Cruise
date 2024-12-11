import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from './api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for form data and trip details
  const [formData, setFormData] = useState({
    name: "John Doe",
    cardNumber: "4111 1111 1111 1111",
    securityCode: "123",
    expirationDate: getDefaultExpirationDate(),
    country: "United States",
    zip: "12345",
    paymentMethod: "Credit Card"
  });

  // State to manage password visibility and form errors
  const [showSecurityCode, setShowSecurityCode] = useState(false);
  const [errors, setErrors] = useState({});

  // State for trip and booking details
  const [totalCost, setTotalCost] = useState(0);
  const [tripDetails, setTripDetails] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [passengerIds, setPassengerIds] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [guests, setGuests] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [tripId, setTripId] = useState(null);

  // Default expiration date function
  function getDefaultExpirationDate() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${nextYear}-${month}`;
  }

  // Fetch trip details from previous page
  useEffect(() => {
    const { 
      selectedCruise, 
      roomsData, 
      totalCost, 
      selectedPackages, 
      trip_id, 
      group_id, 
      passenger_ids,
      guests,
      tripDetails
    } = location.state || {};

    if (totalCost && group_id && passenger_ids) {
      setTotalCost(totalCost);
      setGroupId(group_id);
      setPassengerIds(passenger_ids);
      setSelectedPackages(selectedPackages);
      setGuests(guests);
      setRoomsData(roomsData);
      setTripDetails(tripDetails);
      setTripId(trip_id);
    } else {
      console.log("No trip details found");
    }
  }, [location, navigate]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits)
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Security code validation (3-4 digits)
    if (!/^\d{3,4}$/.test(formData.securityCode)) {
      newErrors.securityCode = "Security code must be 3-4 digits";
    }

    // Expiration date validation
    const currentDate = new Date();
    const expirationDate = new Date(formData.expirationDate);
    if (expirationDate < currentDate) {
      newErrors.expirationDate = "Card has expired";
    }

    // Name validation
    if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format card number
  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setFormData((prev) => ({ 
      ...prev, 
      cardNumber: formattedValue 
    }));
  };

  // Toggle security code visibility
  const handleToggleSecurityCode = () => {
    setShowSecurityCode(!showSecurityCode);
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return duration;
  }

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const paymentResponse = await axios.post('/api/booking-payment/', {
        passenger_id: passengerIds[0],
        group_id: groupId,
        trip_id: tripDetails.trip_info.trip_id,
        total_cost: totalCost,
        payment_method: formData.paymentMethod,
        packages: selectedPackages
      });

      navigate('/success', { 
        state: { 
            bookingDetails: paymentResponse.data.booking,
            invoiceDetails: paymentResponse.data.invoice,
            paymentDetails: paymentResponse.data.payment,
            selectedCruise: tripDetails.trip_info,
            totalCost,
            selectedPackages,
            guests
        } 
      });
    } catch (error) {
      console.error('Payment processing error:', error.response?.data);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 3 
          }}
        >
          <PaymentIcon sx={{ mr: 2 }} /> Payment Information
        </Typography>

        {/* Trip Summary Section */}
        {tripDetails && (
            <Card 
                variant="outlined" 
                sx={{ 
                mb: 3, 
                background: 'linear-gradient(145deg, #f0f4f8 0%, #e6eaf0 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <CardContent>
                {/* Cruise Header */}
                <Box 
                    sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}
                >
                    <Box>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        {tripDetails.trip_info?.ship_name} Cruise
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {tripDetails.trip_info?.start_date} to {tripDetails.trip_info?.end_date}
                    </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                    Total Cost: ${totalCost.toFixed(2)}
                    </Typography>
                </Box>

                {/* Detailed Trip Information Grid */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                        Cruise Itinerary
                        </Typography>
                        <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        mb: 1,
                        p: 1,
                        bgcolor: 'grey.100',
                        borderRadius: 1
                        }}>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">Departure Port</Typography>
                            <Typography variant="body2" color="text.secondary">
                            {tripDetails.trip_info?.start_port}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight="bold">Arrival Port</Typography>
                            <Typography variant="body2" color="text.secondary">
                            {tripDetails.trip_info?.end_port}
                            </Typography>
                        </Box>
                        </Box>
                    </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <Box sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                        Selected Packages
                        </Typography>
                        {selectedPackages && selectedPackages.map((packageGroup, guestIndex) => (
                        <Box key={guestIndex} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                            Guest {guestIndex + 1} Packages
                            </Typography>
                            {Object.entries(packageGroup).map(([packageId, quantity]) => {
                            const packages = location.state?.tripDetails?.packages || [];
                            const packageDetails = packages.find(
                                pkg => pkg.package_id === Number(packageId)
                            );
                            
                            return packageDetails ? (
                                <Box 
                                key={packageId} 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    bgcolor: 'grey.100',
                                    p: 1,
                                    borderRadius: 1,
                                    mb: 1
                                }}
                                >
                                <Typography variant="body2">
                                    {packageDetails.package_name}
                                </Typography>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" color="primary">
                                    ${packageDetails.package_price}
                                    </Typography>
                                    {packageDetails.price_type && (
                                    <Typography variant="caption" color="text.secondary">
                                        {packageDetails.price_type}
                                    </Typography>
                                    )}
                                </Box>
                                </Box>
                            ) : null;
                            })}
                        </Box>
                        ))}
                    </Box>
                    </Grid>
                </Grid>

                {/* Additional Trip Information */}
                <Box 
                    sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText',
                    p: 2, 
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                    }}
                >
                    <Box>
                    <Typography variant="subtitle2">
                        Passengers: {tripDetails.trip_info?.number_passengers}
                    </Typography>
                    <Typography variant="caption">
                        Trip ID: {tripDetails.trip_info?.trip_id}
                    </Typography>
                    </Box>
                    <Typography variant="subtitle2">
                    Duration: {calculateDuration(tripDetails.trip_info?.start_date, tripDetails.trip_info?.end_date)} days
                    </Typography>
                </Box>
                </CardContent>
            </Card>
            )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name on Card"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Security Code"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleChange}
                error={!!errors.securityCode}
                helperText={errors.securityCode}
                required
                type={showSecurityCode ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleSecurityCode}
                        edge="end"
                      >
                        {showSecurityCode ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiration Date"
                name="expirationDate"
                type="month"
                value={formData.expirationDate}
                onChange={handleChange}
                error={!!errors.expirationDate}
                helperText={errors.expirationDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<PaymentIcon />}
              >
                Pay ${totalCost.toFixed(2)}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default PaymentForm; 