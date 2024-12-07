import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CruiseCard from "./CruiseCard";
import axios from "./api";
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

  if (loading) {
    return (
      <div className="home-container">
        <p>Loading trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <p>{error}</p>
      </div>
    );
  }

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
              {/* List unique departure ports */}
              {Array.from(new Set(trips.map((trip) => trip.start_port))).map(
                (port) => (
                  <option key={port} value={port}>
                    {port}
                  </option>
                )
              )}
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
        {trips.map((trip) => (
          <CruiseCard
            key={trip.trip_id}
            cruise={trip}
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
