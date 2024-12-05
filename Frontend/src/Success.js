import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const SuccessPage = () => {
  const location = useLocation(); // Get data passed from the previous page (e.g., booking info)
  const navigate = useNavigate();

  // Example booking data (you can simulate this or pass it from the previous page)
  const { numberOfPeople, numberOfRooms, selectedPackages, totalCost } =
    location.state || {};

  return (
    <div className="success-container">
      <h2>Booking Confirmation</h2>
      <div className="success-details">
        <p>Thank you for booking your cruise with us!</p>
        <p>Your booking is confirmed. Below are your booking details:</p>

        <div className="booking-summary">
          <p>
            <strong>Number of People:</strong> {numberOfPeople}
          </p>
          <p>
            <strong>Number of Rooms:</strong> {numberOfRooms}
          </p>
          {selectedPackages && selectedPackages.length > 0 && (
            <div>
              <strong>Selected Packages:</strong>
              <ul>
                {selectedPackages.map((pkg, index) => (
                  <li key={index}>{pkg}</li>
                ))}
              </ul>
            </div>
          )}
          <p>
            <strong>Total Cost:</strong> ${totalCost}
          </p>
        </div>

        <button onClick={() => navigate("/")} className="home-button">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
