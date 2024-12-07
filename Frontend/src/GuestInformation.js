import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles.css";

const GuestInformation = () => {
  const { state } = useLocation(); // Retrieve state from TotalCost
  const { roomsData, totalCost, selectedCruise } = state || {}; // Extract data

  if (!roomsData || roomsData.length === 0) {
    console.error("roomsData is missing or improperly formatted");
    return <div>Error: Missing room data</div>;
  }

  // Generate initial state for guests
  const [guests, setGuests] = useState(
    roomsData.flatMap((room, roomIndex) =>
      Array.from({ length: room.adults + room.children }, (_, guestIndex) => ({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        country: "",
        state: "",
        email: "",
        phone: "",
        id: `Room ${roomIndex + 1} - Guest ${guestIndex + 1}`,
        roomNumber: roomIndex + 1,
      }))
    )
  );

  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const navigate = useNavigate();

  const handleGuestChange = (id, field, value) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    );
  };

  const handleNextGuest = () => {
    if (currentGuestIndex < guests.length - 1) {
      setCurrentGuestIndex(currentGuestIndex + 1);
    } else {
      alert("All guests have been completed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const incompleteGuests = guests.some(
      (guest) =>
        !guest.firstName ||
        !guest.lastName ||
        !guest.gender ||
        !guest.dob ||
        !guest.country ||
        !guest.state ||
        !guest.phone
    );

    if (incompleteGuests) {
      alert("Please fill out all required fields.");
      return;
    }

    // Navigate to Success Page
    navigate("/success", { state: { totalCost, guests, selectedCruise } });
  };

  return (
    <div className="guest-info-container">
      <h1>Guest Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="guest-form-grid">
          <h3>{guests[currentGuestIndex]?.id}</h3>
          <input
            type="text"
            placeholder="First Name"
            value={guests[currentGuestIndex]?.firstName}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "firstName",
                e.target.value
              )
            }
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={guests[currentGuestIndex]?.lastName}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "lastName",
                e.target.value
              )
            }
            required
          />
          <select
            value={guests[currentGuestIndex]?.gender}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "gender",
                e.target.value
              )
            }
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            value={guests[currentGuestIndex]?.dob}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "dob",
                e.target.value
              )
            }
            required
          />
          <input
            type="text"
            placeholder="Country of Citizenship"
            value={guests[currentGuestIndex]?.country}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "country",
                e.target.value
              )
            }
            required
          />
          <input
            type="text"
            placeholder="State/Province of Residency"
            value={guests[currentGuestIndex]?.state}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "state",
                e.target.value
              )
            }
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={guests[currentGuestIndex]?.email}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "email",
                e.target.value
              )
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={guests[currentGuestIndex]?.phone}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "phone",
                e.target.value
              )
            }
            required
          />
        </div>
        {currentGuestIndex < guests.length - 1 ? (
          <button
            type="button"
            className="submit-button"
            onClick={handleNextGuest}
          >
            Next Guest
          </button>
        ) : (
          <button type="submit" className="submit-button">
            Confirm and Proceed
          </button>
        )}
      </form>
    </div>
  );
};

export default GuestInformation;
