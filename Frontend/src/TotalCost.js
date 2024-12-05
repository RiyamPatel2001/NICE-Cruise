import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const packages = [
  { id: "spa", name: "Spa", price: 200 },
  { id: "excursions", name: "Excursions", price: 150 },
  { id: "dining", name: "Dining", price: 100 },
];

const rooms = [
  { id: "interior", name: "Interior Room", price: 500 },
  { id: "oceanview", name: "Oceanview Room", price: 750 },
  { id: "balcony", name: "Balcony Room", price: 1000 },
  { id: "suite", name: "Suite", price: 1500 },
];

const TotalCost = () => {
  const { state } = useLocation(); // Retrieve state from navigation
  const { selectedCruise, cruisePrice } = state || {};
  const [numberOfGuests, setNumberOfGuests] = useState(1); // Updated to consistent camelCase
  const [numberOfRooms, setNumberOfRooms] = useState(1); // New state for # of Rooms
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const navigate = useNavigate();

  const handlePackageChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPackages((prev) =>
      checked ? [...prev, value] : prev.filter((pkg) => pkg !== value)
    );
  };

  const calculateTotal = () => {
    const roomCost = rooms.find((room) => room.id === selectedRoom)?.price || 0;
    const packageCost = selectedPackages.reduce(
      (total, pkgId) =>
        total + (packages.find((pkg) => pkg.id === pkgId)?.price || 0),
      0
    );
    return cruisePrice + roomCost * numberOfRooms + packageCost;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      alert("Please select a room type.");
      return;
    }

    const totalCost = calculateTotal();
    navigate("/guestInformation", {
      state: { totalCost, numberOfGuests, selectedRoom },
    });
  };

  return (
    <div className="total-cost-container">
      <h1 style={{ textAlign: "center" }}>Total Cost</h1>
      <form onSubmit={handleSubmit}>
        {/* Number of Guests */}
        <div className="packages-group">
          <label>Number of Guests:</label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(Number(e.target.value))}
            min="1"
            required
          />
        </div>

        {/* Packages */}
        <div className="packages-group">
          <label>Select Packages:</label>
          <div className="packages-list">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-item">
                <input
                  type="checkbox"
                  value={pkg.id}
                  onChange={handlePackageChange}
                  checked={selectedPackages.includes(pkg.id)}
                />
                <span>
                  {pkg.name} - ${pkg.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="room-form-row-inline">
          {/* Room Type */}
          <div className="total-form-group">
            <label>Select Room Type:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Select Room Type</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - ${room.price}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Rooms */}
          <div className="total-form-group">
            <label>Number of Rooms:</label>
            <input
              type="number"
              min="1"
              value={numberOfRooms}
              onChange={(e) => setNumberOfRooms(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Total Cost */}
        <div className="total-display">
          <strong>Total Cost: ${calculateTotal()}</strong>
        </div>

        <button type="submit" className="submit-button">
          Confirm and Proceed
        </button>
      </form>
    </div>
  );
};

export default TotalCost;
