import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AIChatCircle from './AIChatCircle';
import axios from "./api";
import "./styles.css";

const TotalCost = () => {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [roomsData, setRoomsData] = useState([{ type: "", adults: 1, children: 0 }]);
  const [selectedPackages, setSelectedPackages] = useState({});
  
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedCruise } = state || {}; // Retrieve selected cruise

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/detailed-trips/${selectedCruise.trip_id}/`);
        setTripDetails(response.data);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCruise && selectedCruise.trip_id) {
      fetchTripDetails();
    } else {
      setLoading(false);
      setError("No cruise selected.");
    }
  }, [selectedCruise]);

  // Dynamically update room data
  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...roomsData];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRoomsData(updatedRooms);
  };

  // Handle package selection and nights input
  const handlePackageChange = (pkgId, field, value) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [pkgId]: {
        ...prev[pkgId],
        [field]: field === "checked" ? value : Number(value),
      },
    }));
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const availableRooms = tripDetails.available_rooms;
    const availablePackages = tripDetails.packages;

    const roomCost = roomsData.reduce((total, room) => {
      const roomDetails = availableRooms.find((r) => r.room_number === Number(room.type));
      return total + (roomDetails?.room_price || 0);
    }, 0);

    const packageCost = Object.entries(selectedPackages).reduce(
      (total, [pkgId, pkgData]) => {
        const pkg = availablePackages.find((pkg) => pkg.package_id === Number(pkgId));
        if (!pkg || !pkgData.checked) return total;

        const nights =
          pkg.price_type === "per night" ? pkgData.nights || 0 : 0;
        const perTripCost =
          pkg.price_type === "per trip" ? pkg.package_price : 0;
        return total + pkg.package_price * nights + perTripCost;
      },
      0
    );

    return roomCost + packageCost;
  };

  // Update number of rooms
  const handleNumberOfRoomsChange = (e) => {
    const newNumber = Number(e.target.value);
    setNumberOfRooms(newNumber);
    setRoomsData(
      Array.from(
        { length: newNumber },
        (_, i) => roomsData[i] || { type: "", adults: 1, children: 0 }
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate room data
    const incompleteRooms = roomsData.some(
      (room) => !room.type || room.adults + room.children > 4
    );
    if (incompleteRooms) {
      alert(
        "Please assign a valid room type and ensure no more than 4 passengers per room."
      );
      return;
    }

    // Calculate total passengers
    const totalPassengers = roomsData.reduce(
      (total, room) => total + room.adults + room.children,
      0
    );
    const totalAdults = roomsData.reduce((total, room) => total + room.adults, 0);
    const totalChildren = roomsData.reduce(
      (total, room) => total + room.children,
      0
    );

    // Prepare data to send to backend
    const groupDetails = {
      total_passengers: totalPassengers,
      adults: totalAdults,
      children: totalChildren,
    };

    try {
      // Send group details to backend
      const response = await axios.post(
        "/api/trip-booking/group-details/",
        groupDetails
      );
      
      const { group_id } = response.data;

      // Handle backend response if needed
      console.log("Group details submitted successfully:", response.data);

      // Navigate to the Guest Information page

      console.log(roomsData)
      navigate("/guest-information", {
        state: { roomsData, totalCost: calculateTotalCost(), selectedCruise, group_id, trip_id: selectedCruise.trip_id, tripDetails },
      });
    } catch (error) {
      console.error("Error submitting group details:", error);
      setError("Failed to submit group details.");
    }
  };

  if (loading) {
    return <div>Loading trip details...</div>;
    
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url('/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        paddingTop: '20px',
        paddingBottom: '40px'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          marginBottom: '30px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h1 style={{
            color: '#00A3FF',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            margin: 0,
            letterSpacing: '1px'
          }}>NICE</h1>
        </div>

        <h1 style={{
          color: '#FFFFFF',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2rem',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '10px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>Your Dream Cruise Awaits!</h1>
        
        <h2 style={{
          color: '#E6F4FF',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: '30px',
          opacity: 0.9
        }}>Get ready to embark on an unforgettable journey!</h2>

        {/* Trip Information */}
        <div className="trip-info section">
          <h2 className="section-title">{tripDetails.trip_info.ship_name}</h2>
          <p>
            <strong>From:</strong> {tripDetails.trip_info.start_port} on {tripDetails.trip_info.start_date}
          </p>
          <p>
            <strong>To:</strong> {tripDetails.trip_info.end_port} on {tripDetails.trip_info.end_date}
          </p>
        </div>

        {/* Ports */}
        <div className="ports-info section">
          <h3 className="section-title">Ports of Call</h3>
          {tripDetails.ports.map((port) => (
            <div key={port.port_id} className="port-item">
              <strong>{port.port_name}</strong> ({port.arrival_date} to {port.departure_date})
              <br />
              {port.address.address_line1}, {port.address.city}, {port.address.state}, {port.address.country}
            </div>
          ))}
        </div>

        {/* Entertainments */}
        <div className="entertainments-info section">
          <h3 className="section-title">Entertainments</h3>
          {tripDetails.entertainments.map((ent) => (
            <div key={ent.entertainment_id} className="entertainment-item">
              <strong>{ent.entertainment_name}</strong> (Age Limit: {ent.age_limit}+)
            </div>
          ))}
        </div>

        {/* Restaurants */}
        <div className="restaurants-info section">
          <h3 className="section-title">Restaurants</h3>
          {tripDetails.restaurants.map((rest) => (
            <div key={rest.restaurant_id} className="restaurant-item">
              <strong>{rest.restaurant_name}</strong>
              <br />
              Open from {rest.opening_time} to {rest.closing_time}, Floor: {rest.floor}
            </div>
          ))}
        </div>
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="booking-form">
          {/* Number of Rooms */}
          <div className="room-details section">
            <h3 className="section-title" style={{
              color: '#007bff',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '20px',
              textShadow: '1px 1px 2px rgba(255,255,255,0.2)'
            }}>Room Selection</h3>
            <div className="room-fields" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              {/* Number of Rooms Selection */}
              <div className="form-field" style={{
                marginBottom: '25px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                paddingBottom: '20px'
              }}>
                <label style={{
                  display: 'block',
                  color: '#4a90e2',
                  fontSize: '1rem',
                  fontWeight: 500,
                  marginBottom: '8px',
                  fontFamily: "'Montserrat', sans-serif"
                }}>
                  Number of Rooms:
                </label>
                <input
                  type="number"
                  value={numberOfRooms}
                  min="1"
                  onChange={(e) => {
                    const number = parseInt(e.target.value);
                    setNumberOfRooms(number);
                    setRoomsData(
                      Array.from({ length: number }, (_, i) => roomsData[i] || { type: "", adults: 1, children: 0 })
                    );
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#4a90e2',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                />
              </div>

              {/* Individual Room Details */}
              {roomsData.map((room, index) => (
                <div key={index} style={{
                  marginBottom: index === roomsData.length - 1 ? 0 : '25px',
                  borderBottom: index === roomsData.length - 1 ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
                  paddingBottom: '20px'
                }}>
                  <h4 style={{
                    color: '#4a90e2',
                    fontSize: '1.1rem',
                    marginBottom: '15px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}>Room {index + 1}</h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      color: '#4a90e2',
                      marginBottom: '8px',
                      fontFamily: "'Montserrat', sans-serif"
                    }}>Room Type:</label>
                    <select
                      value={room.type}
                      onChange={(e) => handleRoomChange(index, "type", e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#4a90e2'
                      }}
                    >
                      <option value="">Select Room Type</option>
                      {tripDetails.available_rooms.map((roomOption) => (
                        <option key={roomOption.room_number} value={roomOption.room_number}>
                          {roomOption.room_type} - ${roomOption.room_price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px',
                    width: '100%'
                  }}>
                    <div style={{ 
                      width: 'calc(50% - 10px)'
                    }}>
                      <label style={{
                        display: 'block',
                        color: '#4a90e2',
                        marginBottom: '8px',
                        fontFamily: "'Montserrat', sans-serif",
                        whiteSpace: 'nowrap'
                      }}>Adults:</label>
                      <input
                        type="number"
                        value={room.adults}
                        min="1"
                        onChange={(e) => handleRoomChange(index, "adults", Number(e.target.value))}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '1rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 0, 0, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: '#4a90e2',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ 
                      width: 'calc(50% - 10px)'
                    }}>
                      <label style={{
                        display: 'block',
                        color: '#4a90e2',
                        marginBottom: '8px',
                        fontFamily: "'Montserrat', sans-serif",
                        whiteSpace: 'nowrap'
                      }}>Children (0-12):</label>
                      <input
                        type="number"
                        value={room.children}
                        min="0"
                        onChange={(e) => handleRoomChange(index, "children", Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '1rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 0, 0, 0.3)',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          color: '#4a90e2',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Packages */}
          {/* <div className="packages-group section">
            <h3 className="section-title">Select Packages</h3>
            <div className="packages-grid">
              {tripDetails.packages.map((pkg) => (
                <div key={pkg.package_id} className="package-item">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handlePackageChange(pkg.package_id, "checked", e.target.checked)
                    }
                  />
                  <span>
                    <strong>{pkg.package_name}</strong> - ${pkg.package_price} (
                    {pkg.price_type})
                  </span>
                  <p className="package-description">{pkg.description}</p>

                  {pkg.price_type === "per night" &&
                    selectedPackages[pkg.package_id]?.checked && (
                      <input
                        type="number"
                        min="1"
                        placeholder="Number of Nights"
                        className="nights-input"
                        onChange={(e) =>
                          handlePackageChange(pkg.package_id, "nights", e.target.value)
                        }
                      />
                    )}
                </div>
              ))}
            </div>
          </div> */}

          {/* Total Cost */}
          <div className="total-display">
            <strong>Estimated Cost: ${calculateTotalCost()}</strong>
          </div>

          <button type="submit" className="submit-button">
            Confirm and Proceed
          </button>
        </form>
      </div>

      {/* Add AI Chat Circle */}
      {tripDetails && (
        <AIChatCircle 
          tripId={tripDetails.trip_info.trip_id} 
        />
      )}
    </div>
  );
};

export default TotalCost;
