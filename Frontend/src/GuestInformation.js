import { Box, Button, Card, CardContent, Checkbox, Container, FormControlLabel, Grid, Paper, TextField, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "./api";
import "./styles.css";

const GuestInformation = () => {
  const { state } = useLocation(); // Retrieve state from TotalCost
  const { roomsData, totalCost, selectedCruise, group_id, trip_id, tripDetails} = state || {}; // Extract data

  const [packageTotalCost, setPackageTotalCost] = useState(0);

  const navigate = useNavigate();

  // Generate initial state for guests
  const [guests, setGuests] = useState(
    roomsData.flatMap((room, roomIndex) =>
      Array.from({ length: room.adults + room.children }, (_, guestIndex) => ({
        firstName: `FirstName${roomIndex + 1}_${guestIndex + 1}`,
        lastName: `LastName${roomIndex + 1}_${guestIndex + 1}`,
        gender: guestIndex % 2 === 0 ? "Male" : "Female",
        dob: "1990-01-01",
        country: "United States",
        state: "California",
        city: `City${roomIndex + 1}`,
        zipCode: "12345",
        addressLine1: `${guestIndex + 1} Main St`,
        email: `guest${roomIndex + 1}_${guestIndex + 1}@example.com`,
        phone: `555-${roomIndex + 1}${guestIndex + 1}0-0000`,
        id: `Room ${room.type} - Guest ${guestIndex + 1}`,
        roomNumber: room.type,
        isChild: guestIndex >= room.adults,
        selectedPackages: {}  // Initialize empty packages
      }))
    )
  );

  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);

  const handleGuestChange = (id, field, value) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    );
  };

  const handlePackageChange = (guestId, packageId, field, value) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === guestId
          ? {
              ...guest,
              selectedPackages: {
                ...guest.selectedPackages,
                [packageId]: {
                  ...guest.selectedPackages[packageId],
                  [field]: field === 'checked' ? value : Number(value)
                }
              }
            }
          : guest
      )
    );
    calculateTotalPackageCost();
  };

  const handleNextGuest = () => {
    if (currentGuestIndex < guests.length - 1) {
      setCurrentGuestIndex(currentGuestIndex + 1);
    } else {
      alert("All guests have been completed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const incompleteGuests = guests.some(
      (guest) =>
        !guest.firstName ||
        !guest.lastName ||
        !guest.gender ||
        !guest.dob ||
        !guest.country ||
        !guest.state ||
        !guest.city ||
        !guest.zipCode ||
        !guest.addressLine1 ||
        !guest.phone
    );

    if (incompleteGuests) {
      alert("Please fill out all required fields.");
      return;
    }

    // Prepare passengers data for backend
    const passengersData = {
      group_id: group_id,
      trip_id: trip_id,
      passengers: guests.map((guest) => ({
        fname: guest.firstName,
        lname: guest.lastName,
        gender: guest.gender,
        age: calculateAge(guest.dob),
        email: guest.email || "",
        phone: guest.phone,
        nationality: guest.country,
        room_number: guest.roomNumber,
        address: {
          address_line1: guest.addressLine1,
          address_line2: guest.addressLine2 || "",
          city: guest.city,
          state: guest.state,
          zip_code: guest.zipCode,
          country: guest.country,
        },
        selectedPackages: guest.selectedPackages,
      })),
    };

    try {
      // Send passengers data to backend
      const response = await axios.post(
        "/api/trip-booking/add-passengers/",
        passengersData
      );

      

      // Handle backend response if needed
      console.log("Passengers added successfully:", response.data);
      

      const passenger_ids = response.data.created_passengers.map(
        passenger => passenger.passenger_id
      );

      const transformedSelectedPackages = guests.map(guest => 
        Object.entries(guest.selectedPackages)
          .filter(([_, packageData]) => packageData.checked)
          .reduce((acc, [packageId, packageData]) => {
            acc[packageId] = packageData.nights || 1;
            return acc;
          }, {})
      );

      const totalPackageCost = guests.reduce((total, guest) => {
        return total + Object.entries(guest.selectedPackages).reduce(
          (packageTotal, [pkgId, pkgData]) => {
            const pkg = tripDetails.packages.find(
              (p) => p.package_id === Number(pkgId)
            );
            
            if (!pkg || !pkgData.checked) return packageTotal;
  
            if (pkg.price_type === "per night") {
              return packageTotal + (pkg.package_price * (pkgData.nights || 0));
            } else if (pkg.price_type === "per trip") {
              return packageTotal + pkg.package_price;
            }
            
            return packageTotal;
          },
          0
        );
      }, 0);
      

      console.log(tripDetails)
      // Navigate to Total Cost page with all necessary information
      navigate('/payment-form', {
        state: {
          selectedCruise,
          roomsData,
          totalCost: totalCost + totalPackageCost,
          selectedPackages: transformedSelectedPackages,
          trip_id,
          group_id: response.data.group_id,
          passenger_ids: passenger_ids,
          guests: guests,  // Pass the entire guests array
          tripDetails: tripDetails
        }
      });

    } catch (error) {
      console.error("Error adding passengers:", error.response?.data || error);
      console.log(passengersData)
      alert("Failed to add passengers. Please try again.");
    }
  };

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Calculate package cost using the same logic as TotalCost.js
  const calculateTotalPackageCost = () => {
    const totalPackageCost = guests.reduce((total, guest) => {
      const guestPackageCost = Object.entries(guest.selectedPackages).reduce(
        (packageTotal, [pkgId, pkgData]) => {
          const pkg = tripDetails.packages.find(
            (p) => p.package_id === Number(pkgId)
          );
          
          if (!pkg || !pkgData.checked) return packageTotal;

          if (pkg.price_type === "per night") {
            return packageTotal + (pkg.package_price * (pkgData.nights || 0));
          } else if (pkg.price_type === "per trip") {
            return packageTotal + pkg.package_price;
          }
          
          return packageTotal;
        },
        0
      );
      return total + guestPackageCost;
    }, 0);
    
    setPackageTotalCost(totalPackageCost);
  };

  return (
    <div style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover', 
      backgroundPosition: 'center',minHeight: '100vh', padding: '20px' }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: '16px' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Guest Information
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="guest-form-grid">
              <h3>{guests[currentGuestIndex]?.id}</h3>
              {/* First Name */}
              <input
                type="text"
                placeholder="First Name"
                value={guests[currentGuestIndex]?.firstName}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "firstName",
                    e.target.value
                  )
                }
                required
              />
              {/* Last Name */}
              <input
                type="text"
                placeholder="Last Name"
                value={guests[currentGuestIndex]?.lastName}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "lastName",
                    e.target.value
                  )
                }
                required
              />
              {/* Gender */}
              <select
                value={guests[currentGuestIndex]?.gender}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "gender",
                    e.target.value
                  )
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {/* Date of Birth */}
              <Tooltip 
                title="Select your birth date" 
                arrow
                placement="top"
                sx={{
                  tooltip: {
                    fontSize: '16px', // Adjust the font size
                    padding: '10px', // Adjust the padding
                  },
                  arrow: {
                    fontSize: '1rem', // Adjust the arrow size
                  }
                }}
              >
                <input
                  type="date"
                  value={guests[currentGuestIndex]?.dob}
                  onChange={(e) =>
                    handleGuestChange(guests[currentGuestIndex]?.id, "dob", e.target.value)
                  }
                  required
                  className="guest-form-grid-input"
                />
              </Tooltip>
              {/* Country */}
              <input
                type="text"
                placeholder="Country"
                value={guests[currentGuestIndex]?.country}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "country",
                    e.target.value
                  )
                }
                required
              />
              {/* State */}
              <input
                type="text"
                placeholder="State/Province"
                value={guests[currentGuestIndex]?.state}
                onChange={(e) =>
                  handleGuestChange(guests[currentGuestIndex]?.id, "state", e.target.value)
                }
                required
              />
              {/* City */}
              <input
                type="text"
                placeholder="City"
                value={guests[currentGuestIndex]?.city}
                onChange={(e) =>
                  handleGuestChange(guests[currentGuestIndex]?.id, "city", e.target.value)
                }
                required
              />
              {/* Zip Code */}
              <input
                type="text"
                placeholder="Zip Code"
                value={guests[currentGuestIndex]?.zipCode}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "zipCode",
                    e.target.value
                  )
                }
                required
              />
              {/* Address Line 1 */}
              <input
                type="text"
                placeholder="Address Line 1"
                value={guests[currentGuestIndex]?.addressLine1}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "addressLine1",
                    e.target.value
                  )
                }
                required
              />
              {/* Address Line 2 */}
              <input
                type="text"
                placeholder="Address Line 2"
                value={guests[currentGuestIndex]?.addressLine2}
                onChange={(e) =>
                  handleGuestChange(
                    guests[currentGuestIndex]?.id,
                    "addressLine2",
                    e.target.value
                  )
                }
              />
              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                value={guests[currentGuestIndex]?.email}
                onChange={(e) =>
                  handleGuestChange(guests[currentGuestIndex]?.id, "email", e.target.value)
                }
              />
              {/* Phone */}
              <input
                type="text"
                placeholder="Phone Number"
                value={guests[currentGuestIndex]?.phone}
                onChange={(e) =>
                  handleGuestChange(guests[currentGuestIndex]?.id, "phone", e.target.value)
                }
                required
              />
            </div>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  borderBottom: '2px solid #1976d2',
                  pb: 1,
                  mb: 3,
                  color: '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                Select Packages for {guests[currentGuestIndex]?.id}
              </Typography>
              <Grid container spacing={3}>
                {tripDetails.packages.map((pkg) => (
                  <Grid item xs={12} sm={6} md={4} key={pkg.package_id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        },
                        border: guests[currentGuestIndex]?.selectedPackages[pkg.package_id]?.checked 
                          ? '2px solid #1976d2' 
                          : '1px solid rgba(0, 0, 0, 0.12)',
                        position: 'relative',
                        overflow: 'visible',
                        borderRadius: '16px',
                      }}
                    >
                      <CardContent sx={{ 
                        p: 3,
                        '&:last-child': { pb: 3 },
                        borderRadius: '16px',
                      }}>
                        <Typography 
                          variant="h6" 
                          component="div" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#2c3e50',
                            mb: 1
                          }}
                        >
                          {pkg.package_name}
                        </Typography>
                        <Typography 
                          sx={{ 
                            mb: 2,
                            color: '#1976d2',
                            fontSize: '1.25rem',
                            fontWeight: '500'
                          }}
                        >
                          ${pkg.package_price} 
                          <Typography 
                            component="span" 
                            sx={{ 
                              color: '#666',
                              fontSize: '0.875rem'
                            }}
                          >
                            ({pkg.price_type})
                          </Typography>
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 3,
                            color: '#666',
                            minHeight: '60px',
                            lineHeight: '1.6'
                          }}
                        >
                          {pkg.description}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={guests[currentGuestIndex]?.selectedPackages[pkg.package_id]?.checked || false}
                              onChange={(e) =>
                                handlePackageChange(
                                  guests[currentGuestIndex]?.id,
                                  pkg.package_id,
                                  'checked',
                                  e.target.checked
                                )
                              }
                              sx={{
                                color: '#1976d2',
                                '&.Mui-checked': {
                                  color: '#1976d2',
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ fontWeight: '500' }}>
                              Select Package
                            </Typography>
                          }
                        />
                        {pkg.price_type === "per night" && 
                          guests[currentGuestIndex]?.selectedPackages[pkg.package_id]?.checked && (
                            <TextField
                              label="Number of Nights"
                              type="number"
                              min="1"
                              value={guests[currentGuestIndex]?.selectedPackages[pkg.package_id]?.nights || 0}
                              onChange={(e) =>
                                handlePackageChange(
                                  guests[currentGuestIndex]?.id,
                                  pkg.package_id,
                                  'nights',
                                  e.target.value
                                )
                              }
                              sx={{ 
                                mt: 2,
                                width: '100%',
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                  },
                                },
                              }}
                              InputProps={{
                                sx: { borderRadius: '12px' }
                              }}
                            />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {currentGuestIndex < guests.length - 1 ? (
                <Button variant="contained" 
                  type="button"
                  onClick={handleNextGuest}>
                  Next Guest
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  Confirm and Proceed
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default GuestInformation;
