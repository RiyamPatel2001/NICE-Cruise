import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from './api';

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for form data and trip details
  const [formData, setFormData] = useState({
    name: "John Doe",  // Default name
    cardNumber: "4111 1111 1111 1111",  // Valid test Visa card number
    securityCode: "123",  // Default CVV
    expirationDate: getDefaultExpirationDate(),  // Future date
    country: "United States",  // Default country
    zip: "12345",  // Default ZIP code
    paymentMethod: "Credit Card"  // Default payment method
  });

  function getDefaultExpirationDate() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${nextYear}-${month}`;
  }

  // State for total cost and trip details
  const [totalCost, setTotalCost] = useState(0);
  const [tripDetails, setTripDetails] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [passengerIds, setPassengerIds] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [guests, setGuests] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [tripId, setTripId] = useState(null);

  // Validation states
  const [errors, setErrors] = useState({});

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
      // Redirect if no trip details
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

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      console.log(tripDetails)
      const paymentResponse = await axios.post('/api/booking-payment/', {
        passenger_id: passengerIds[0],
        group_id: groupId,
        trip_id: tripDetails.trip_info.trip_id,
        total_cost: totalCost,
        payment_method: formData.paymentMethod,
        packages: selectedPackages
      });

      console.log('Navigating to Success page with state:', {
        bookingDetails: paymentResponse.data.booking,
        invoiceDetails: paymentResponse.data.invoice,
        paymentDetails: paymentResponse.data.payment,
        selectedCruise: tripDetails?.selectedCruise,
        totalCost,
        selectedPackages,
        guests
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
      // Handle payment errors
      console.error('Payment processing error:', error.response?.data);
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Information</h1>
    {tripDetails && (
      <div className="payment-summary">
        <h2>{tripDetails.selectedCruise?.ship_name} Cruise</h2>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
        
        {/* Room Information */}
        <div className="room-details">
          <h3>Room Details</h3>
          {roomsData && roomsData.map((room, index) => (
            <div key={index} className="room-info">
              <p>Room {index + 1}: {room.type}</p>
              <p>Adults: {room.adults}</p>
              <p>Children: {room.children}</p>
            </div>
          ))}
        </div>

        {/* Detailed Package Information */}
        <div className="selected-packages">
          <h3>Selected Packages:</h3>
          {selectedPackages && selectedPackages.map((packageGroup, guestIndex) => (
            <div key={guestIndex}>
              <h4>Guest {guestIndex + 1} Packages:</h4>
              {Object.entries(packageGroup).map(([packageId, quantity]) => {
                // Fallback to empty array if packages is undefined
                const packages = location.state?.tripDetails?.packages || [];
                
                // Find the full package details
                const packageDetails = packages.find(
                  pkg => pkg.package_id === Number(packageId)
                );
                
                return packageDetails ? (
                  <div key={packageId} className="package-detail">
                    <p><strong>{packageDetails.package_name}</strong></p>
                    <p>Price: ${packageDetails.package_price}</p>
                    <p>Price Type: {packageDetails.price_type}</p>
                    <p>Description: {packageDetails.description}</p>
                    {packageDetails.price_type === 'per night' && (
                      <p>Number of Nights: {quantity}</p>
                    )}
                  </div>
                ) : (
                  <div key={packageId} className="package-detail">
                    <p>Package {packageId} Details Unavailable</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    )}

      <form className="payment-form" onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="payment-form-group">
          <label>Name on Card</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name as it appears on the card"
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Card Number Input */}
        <div className="payment-form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
          {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
        </div>

        {/* Security Code Input */}
        <div className="payment-form-group">
          <label>Security Code</label>
          <input
            type="text"
            name="securityCode"
            value={formData.securityCode}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            required
          />
          {errors.securityCode && <span className="error">{errors.securityCode}</span>}
        </div>

        {/* Expiration Date Input */}
        <div className="payment-form-group">
          <label>Expiration Date</label>
          <input
            type="month"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            required
          />
          {errors.expirationDate && <span className="error">{errors.expirationDate}</span>}
        </div>

        {/* Country Input */}
        <div className="payment-form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
          />
        </div>

        {/* ZIP Code Input */}
        <div className="payment-form-group">
          <label>ZIP Code</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="12345"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Pay ${totalCost.toFixed(2)}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 