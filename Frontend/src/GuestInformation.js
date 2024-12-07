import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "./api";
import "./styles.css";

const GuestInformation = () => {
  const { state } = useLocation(); // Retrieve state from TotalCost
  const { roomsData, totalCost, selectedCruise, group_id, trip_id } = state || {}; // Extract data

  const navigate = useNavigate();

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
        city: "",
        zipCode: "",
        addressLine1: "",
        addressLine2: "",
        email: "",
        phone: "",
        id: `Room ${roomIndex + 1} - Guest ${guestIndex + 1}`,
        roomNumber: room.type, // Assuming room.type contains room number
        isChild: guestIndex >= room.adults, // To determine if the guest is a child
      }))
    )
  );

  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);

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

  const handleSubmit = async (e) => {
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
        !guest.city ||
        !guest.zipCode ||
        !guest.addressLine1 ||
        !guest.phone
    );

    if (incompleteGuests) {
      alert("Please fill out all required fields.");
      return;
    }

    // Prepare passengers data for backend
    const passengersData = {
      group_id: group_id,
      trip_id: trip_id,
      passengers: guests.map((guest) => ({
        fname: guest.firstName,
        lname: guest.lastName,
        gender: guest.gender,
        age: calculateAge(guest.dob),
        email: guest.email || "",
        phone: guest.phone,
        nationality: guest.country,
        room_number: guest.roomNumber,
        address: {
          address_line1: guest.addressLine1,
          address_line2: guest.addressLine2 || "",
          city: guest.city,
          state: guest.state,
          zip_code: guest.zipCode,
          country: guest.country,
        },
      })),
    };

    try {
      // Send passengers data to backend
      const response = await axios.post(
        "/api/trip-booking/add-passengers/",
        passengersData
      );

      const { group_id } = response.data;

      // Handle backend response if needed
      console.log("Passengers added successfully:", response.data);

      // Navigate to Success Page
      navigate("/success", { state: { totalCost, guests, selectedCruise, group_id, trip_id } });
    } catch (error) {
      console.error("Error adding passengers:", error.response?.data || error);
      console.log(passengersData)
      alert("Failed to add passengers. Please try again.");
    }
  };

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="guest-info-container">
      <h1>Guest Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="guest-form-grid">
          <h3>{guests[currentGuestIndex]?.id}</h3>
          {/* First Name */}
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
          {/* Last Name */}
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
          {/* Gender */}
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
          {/* Date of Birth */}
          <input
            type="date"
            value={guests[currentGuestIndex]?.dob}
            onChange={(e) =>
              handleGuestChange(guests[currentGuestIndex]?.id, "dob", e.target.value)
            }
            required
          />
          {/* Country */}
          <input
            type="text"
            placeholder="Country"
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
          {/* State */}
          <input
            type="text"
            placeholder="State/Province"
            value={guests[currentGuestIndex]?.state}
            onChange={(e) =>
              handleGuestChange(guests[currentGuestIndex]?.id, "state", e.target.value)
            }
            required
          />
          {/* City */}
          <input
            type="text"
            placeholder="City"
            value={guests[currentGuestIndex]?.city}
            onChange={(e) =>
              handleGuestChange(guests[currentGuestIndex]?.id, "city", e.target.value)
            }
            required
          />
          {/* Zip Code */}
          <input
            type="text"
            placeholder="Zip Code"
            value={guests[currentGuestIndex]?.zipCode}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "zipCode",
                e.target.value
              )
            }
            required
          />
          {/* Address Line 1 */}
          <input
            type="text"
            placeholder="Address Line 1"
            value={guests[currentGuestIndex]?.addressLine1}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "addressLine1",
                e.target.value
              )
            }
            required
          />
          {/* Address Line 2 */}
          <input
            type="text"
            placeholder="Address Line 2"
            value={guests[currentGuestIndex]?.addressLine2}
            onChange={(e) =>
              handleGuestChange(
                guests[currentGuestIndex]?.id,
                "addressLine2",
                e.target.value
              )
            }
          />
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={guests[currentGuestIndex]?.email}
            onChange={(e) =>
              handleGuestChange(guests[currentGuestIndex]?.id, "email", e.target.value)
            }
          />
          {/* Phone */}
          <input
            type="text"
            placeholder="Phone Number"
            value={guests[currentGuestIndex]?.phone}
            onChange={(e) =>
              handleGuestChange(guests[currentGuestIndex]?.id, "phone", e.target.value)
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
