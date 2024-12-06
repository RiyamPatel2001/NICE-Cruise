import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Ensure useLocation is imported
import "./styles.css";

const rooms = [
  { id: "interior", name: "Interior Room", price: 500 },
  { id: "oceanview", name: "Oceanview Room", price: 750 },
  { id: "balcony", name: "Balcony Room", price: 1000 },
  { id: "suite", name: "Suite", price: 1500 },
];

const packages = [
  { id: "spa", name: "Spa", price: 200 },
  { id: "excursions", name: "Excursions", price: 150 },
  { id: "dining", name: "Dining", price: 100 },
];

const TotalCost = () => {
  const { state } = useLocation(); // Import and use useLocation to retrieve state
  const { selectedCruise } = state || {}; // Retrieve selected cruise safely
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [roomsData, setRoomsData] = useState([
    { type: "", adults: 1, children: 0 },
  ]); // Store room details
  const [selectedPackages, setSelectedPackages] = useState([]);
  const navigate = useNavigate();

  // Dynamically update room data
  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...roomsData];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    setRoomsData(updatedRooms);
  };

  // Handle package selection
  const handlePackageChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPackages((prev) =>
      checked ? [...prev, value] : prev.filter((pkg) => pkg !== value)
    );
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const roomCost = roomsData.reduce(
      (total, room) =>
        total + (rooms.find((r) => r.id === room.type)?.price || 0),
      0
    );
    const packageCost = selectedPackages.reduce(
      (total, pkgId) =>
        total + (packages.find((pkg) => pkg.id === pkgId)?.price || 0),
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

  const handleSubmit = (e) => {
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

    // Navigate to the Guest Information page
    navigate("/guestInformation", {
      state: { roomsData, totalCost: calculateTotalCost(), selectedCruise },
    });
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>NICE</h1>
      </header>
      <form onSubmit={handleSubmit}>
        {/* Number of Rooms */}
        <div className="total-form-group">
          <label>Number of Rooms:</label>
          <input
            type="number"
            value={numberOfRooms}
            min="1"
            onChange={handleNumberOfRoomsChange}
            required
          />
        </div>

        {/* Room Details */}
        {roomsData.map((room, index) => (
          <div key={index} className="room-section">
            <h3>Room {index + 1}</h3>
            <div className="room-details-grid">
              <div>
                <label>Room Type:</label>
                <select
                  value={room.type}
                  onChange={(e) =>
                    handleRoomChange(index, "type", e.target.value)
                  }
                  required
                >
                  <option value="">Select Room Type</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - ${r.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Adults:</label>
                <input
                  type="number"
                  value={room.adults}
                  min="1"
                  onChange={(e) =>
                    handleRoomChange(index, "adults", Number(e.target.value))
                  }
                  required
                />
              </div>
              <div>
                <label>Children (0-12):</label>
                <input
                  type="number"
                  value={room.children}
                  min="0"
                  onChange={(e) =>
                    handleRoomChange(index, "children", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {/* Packages */}
        <div className="packages-group">
          <label>Select Packages:</label>
          <div className="packages-grid">
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

        {/* Total Cost */}
        <div className="total-display">
          <strong>Total Cost: ${calculateTotalCost()}</strong>
        </div>

        <button type="submit" className="submit-button">
          Confirm and Proceed
        </button>
      </form>
    </div>
  );
};

export default TotalCost;
