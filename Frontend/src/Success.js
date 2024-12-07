import React from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";

const SuccessPage = () => {
  const { state } = useLocation(); // Retrieve data from GuestInformation
  const { totalCost, guests, selectedCruise } = state || {};

  if (!state || !totalCost || !guests || !selectedCruise) {
    return <div>Error: Missing required information.</div>;
  }

  return (
    <div className="success-container">
      <header className="header">
        <h1>Booking Confirmed</h1>
      </header>

      {/* Cruise Information */}
      <section className="cruise-info">
        <h2>Cruise Details</h2>
        <p>
          <strong>Destination:</strong> {selectedCruise.destination}
        </p>
        <p>
          <strong>Departure Port:</strong> {selectedCruise.departurePort}
        </p>
        <p>
          <strong>Departure Date:</strong> {selectedCruise.leavingDate}
        </p>
        <h3>Itinerary:</h3>
        <ul>
          {selectedCruise.ports.map((port, index) => (
            <li key={index}>
              Day {port.day}: {port.location} {port.time && `- ${port.time}`}
            </li>
          ))}
        </ul>
      </section>

      {/* Guests Information */}
      <section className="guests-info">
        <h2>Guest Details</h2>
        {guests.map((guest, index) => (
          <div key={guest.id} className="guest-card">
            <h3>
              Room {guest.roomNumber} - Guest {index + 1}
            </h3>
            <p>
              <strong>Name:</strong> {guest.firstName} {guest.lastName}
            </p>
            <p>
              <strong>Gender:</strong> {guest.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong> {guest.dob}
            </p>
            <p>
              <strong>Country of Citizenship:</strong> {guest.country}
            </p>
            <p>
              <strong>State/Province of Residency:</strong> {guest.state}
            </p>
            {guest.email && (
              <p>
                <strong>Email:</strong> {guest.email}
              </p>
            )}
            <p>
              <strong>Phone:</strong> {guest.phone}
            </p>
          </div>
        ))}
      </section>

      {/* Total Cost */}
      <section className="total-cost">
        <h2>Total Cost</h2>
        <p>
          <strong>${totalCost.toFixed(2)}</strong>
        </p>
      </section>
    </div>
  );
};

export default SuccessPage;
