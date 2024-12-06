import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CruiseCard from "./CruiseCard";
import "./styles.css";

const mockCruises = [
  {
    id: 1,
    destination: "Caribbean",
    departurePort: "Miami",
    leavingDate: "2024-12-15",
    price: 1500,
    ports: [
      { day: 1, location: "Miami, Florida", time: "Departs: 3:00 PM" },
      { day: 2, location: "At Sea", time: "" },
      {
        day: 3,
        location: "Nassau, Bahamas",
        time: "Docked: 12:30 PM - 8:00 PM",
      },
      {
        day: 4,
        location: "Perfect Day at CocoCay",
        time: "Docked: 7:00 AM - 5:00 PM",
      },
      { day: 5, location: "At Sea", time: "" },
      { day: 6, location: "Miami, Florida", time: "Arrival: 6:00 AM" },
    ],
  },
  {
    id: 2,
    destination: "Mediterranean",
    departurePort: "Barcelona",
    leavingDate: "2024-12-20",
    price: 1800,
    ports: [
      { day: 1, location: "Barcelona, Spain", time: "Departs: 5:00 PM" },
      { day: 2, location: "At Sea", time: "" },
      { day: 3, location: "Rome, Italy", time: "Docked: 9:00 AM - 6:00 PM" },
      { day: 4, location: "Naples, Italy", time: "Docked: 7:00 AM - 4:00 PM" },
      { day: 5, location: "At Sea", time: "" },
      { day: 6, location: "Barcelona, Spain", time: "Arrival: 7:00 AM" },
    ],
  },
];

const HomePage = () => {
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [departurePort, setDeparturePort] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [departureDate, setDepartureDate] = useState(""); // Added departureDate state
  const navigate = useNavigate();

  // Filter cruises based on user's input
  const filteredCruises = mockCruises.filter((cruise) => {
    const matchesDeparturePort = departurePort
      ? cruise.departurePort.toLowerCase() === departurePort.toLowerCase()
      : true;

    const matchesArrivalPort = arrivalPort
      ? cruise.ports.some((port) =>
          port.location.toLowerCase().includes(arrivalPort.toLowerCase())
        )
      : true;

    const matchesDepartureDate = departureDate
      ? new Date(cruise.leavingDate) >= new Date(departureDate)
      : true;

    return matchesDeparturePort && matchesArrivalPort && matchesDepartureDate;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCruise) {
      navigate("/totalCost", {
        state: { selectedCruise, cruisePrice: selectedCruise.price },
      });
    } else {
      alert("Please select a cruise before proceeding.");
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>NICE</h1>
      </header>

      <h2>Select Your Cruise</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {/* Departure Port */}
          <div className="form-group">
            <label>Departure Port:</label>
            <select
              value={departurePort}
              onChange={(e) => setDeparturePort(e.target.value)}
            >
              <option value="">Any</option>
              <option value="Miami">Miami</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Seattle">Seattle</option>
            </select>
          </div>

          {/* Arrival Port */}
          <div className="form-group">
            <label>Arrival Port:</label>
            <input
              type="text"
              placeholder="Search Arrival Port"
              value={arrivalPort}
              onChange={(e) => setArrivalPort(e.target.value)}
            />
          </div>

          {/* Departure Date */}
          <div className="form-group">
            <label>Departure Date:</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          Proceed to Total Cost
        </button>
      </form>

      {/* Cruise Cards Section */}
      <div className="cruise-cards">
        {filteredCruises.map((cruise) => (
          <CruiseCard
            key={cruise.id}
            cruise={cruise}
            selectedCruise={selectedCruise}
            setSelectedCruise={setSelectedCruise}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
