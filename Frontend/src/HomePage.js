import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

// Mock data for the cruises
const mockCruises = [
  {
    id: 1,
    destination: "Caribbean",
    departurePort: "Miami",
    leavingDate: "2024-12-15",
    price: 1500,
  },
  {
    id: 2,
    destination: "Mediterranean",
    departurePort: "Barcelona",
    leavingDate: "2024-12-20",
    price: 1800,
  },
  {
    id: 3,
    destination: "Alaska",
    departurePort: "Seattle",
    leavingDate: "2024-12-25",
    price: 2000,
  },
];

const HomePage = () => {
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numberOfNights, setNumberOfNights] = useState(1); // Added number of nights state
  const [selectedRoom, setSelectedRoom] = useState(""); // Store room type
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const navigate = useNavigate();

  // Handle the cruise selection
  const handleCruiseSelect = (cruise) => {
    setSelectedCruise(cruise);
  };

  // Handle the room selection
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  // Handle the packages selection
  const handlePackageChange = (e) => {
    const { value } = e.target;
    setSelectedPackages((prev) =>
      prev.includes(value)
        ? prev.filter((pkg) => pkg !== value)
        : [...prev, value]
    );
  };

  // Handle the form submission and navigate to the next page
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCruise && departureDate && selectedRoom) {
      const bookingData = {
        selectedCruise,
        numberOfPeople,
        numberOfNights,
        selectedRoom,
        selectedPackages,
        departureDate,
      };
      navigate("/success", { state: bookingData });
    } else {
      alert("Please select a cruise, room type, and fill out all fields.");
    }
  };

  return (
    <div className="home-container">
      {/* Header with business name and top border */}
      <header className="header">
        <h1>NICE</h1>
      </header>

      <h2>Select Your Cruise</h2>

      {/* Departure Date, Number of People, and Number of Nights side by side */}
      <div className="form-row">
        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of People:</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Nights:</label>
          <input
            type="number"
            value={numberOfNights}
            onChange={(e) => setNumberOfNights(e.target.value)}
            min="1"
            required
          />
        </div>
      </div>

      {/* Display the cruise cards */}
      <div className="cruise-cards">
        {mockCruises.map((cruise) => (
          <div
            key={cruise.id}
            className={`cruise-card ${
              selectedCruise?.id === cruise.id ? "selected" : ""
            }`}
            onClick={() => handleCruiseSelect(cruise)}
          >
            <h3>{cruise.destination}</h3>
            <p>Departure from: {cruise.departurePort}</p>
            <p>Leaving on: {cruise.leavingDate}</p>
            <p>Price: ${cruise.price}</p>
          </div>
        ))}
      </div>

      {/* Room Type and Package Selection */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Type:</label>
          <select value={selectedRoom} onChange={handleRoomChange} required>
            <option value="">Select Room Type</option>
            <option value="Interior">Interior</option>
            <option value="Oceanview">Oceanview</option>
            <option value="Balcony">Balcony</option>
            <option value="Suite">Suite</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Packages:</label>
          <div>
            <input
              type="checkbox"
              value="Spa"
              onChange={handlePackageChange}
              checked={selectedPackages.includes("Spa")}
            />{" "}
            Spa
          </div>
          <div>
            <input
              type="checkbox"
              value="Excursions"
              onChange={handlePackageChange}
              checked={selectedPackages.includes("Excursions")}
            />{" "}
            Excursions
          </div>
          <div>
            <input
              type="checkbox"
              value="Dining"
              onChange={handlePackageChange}
              checked={selectedPackages.includes("Dining")}
            />{" "}
            Dining
          </div>
        </div>

        <button type="submit" className="submit-button">
          Proceed to Total Cost
        </button>
      </form>
    </div>
  );
};

export default HomePage;
