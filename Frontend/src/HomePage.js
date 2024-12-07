import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CruiseCard from "./CruiseCard";
import axios from "./api";
import "./styles.css";

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
      navigate("/total-cost", {
        state: { selectedCruise },
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
