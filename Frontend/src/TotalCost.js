import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";

const rooms = [
  { id: "interior", name: "Interior Room", price: 500 },
  { id: "oceanview", name: "Oceanview Room", price: 750 },
  { id: "balcony", name: "Balcony Room", price: 1000 },
  { id: "suite", name: "Suite", price: 1500 },
];

const packages = [
  {
    package_id: 1,
    package_name: "Water and Non-Alcoholic",
    package_price: 40.0,
    price_type: "per night",
    description:
      "Includes water and non-alcoholic beverages per person per night",
  },
  {
    package_id: 2,
    package_name: "Excursions",
    package_price: 150.0,
    price_type: "per trip",
    description:
      "Includes all on-shore excursions for the duration of the trip",
  },
  {
    package_id: 3,
    package_name: "Spa",
    package_price: 200.0,
    price_type: "per trip",
    description: "Access to the spa facilities for the entire trip",
  },
];

const TotalCost = () => {
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [roomsData, setRoomsData] = useState([
    { type: "", adults: 1, children: 0 },
  ]); // Store room details
  const [selectedPackages, setSelectedPackages] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedCruise } = state || {}; // Retrieve selected cruise

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
    const roomCost = roomsData.reduce((total, room) => {
      const roomType = rooms.find((r) => r.id === room.type);
      return total + (roomType?.price || 0);
    }, 0);

    const packageCost = Object.entries(selectedPackages).reduce(
      (total, [pkgId, pkgData]) => {
        const pkg = packages.find((pkg) => pkg.package_id === Number(pkgId));
        if (!pkg || !pkgData.checked) return total;

        const nights = pkg.price_type === "per night" ? pkgData.nights || 0 : 0;
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
              <div key={pkg.package_id} className="package-item">
                {/* Checkbox for the Package */}
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handlePackageChange(
                      pkg.package_id,
                      "checked",
                      e.target.checked
                    )
                  }
                />
                {/* Package Name, Price, and Description */}
                <span>
                  <strong>{pkg.package_name}</strong> - ${pkg.package_price} (
                  {pkg.price_type})
                </span>
                <p className="package-description">{pkg.description}</p>

                {/* Conditionally Render Nights Input */}
                {pkg.price_type === "per night" &&
                  selectedPackages[pkg.package_id]?.checked && (
                    <input
                      type="number"
                      min="1"
                      placeholder="Number of Nights"
                      className="nights-input"
                      onChange={(e) =>
                        handlePackageChange(
                          pkg.package_id,
                          "nights",
                          e.target.value
                        )
                      }
                    />
                  )}
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
