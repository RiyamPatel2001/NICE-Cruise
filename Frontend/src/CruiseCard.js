import React from "react";

const CruiseCard = ({
  cruise,
  selectedCruise,
  setSelectedCruise,
  expandedCard,
  setExpandedCard,
}) => {
  return (
    <div
      className={`cruise-card ${
        selectedCruise?.id === cruise.id ? "selected" : ""
      }`}
      onClick={() => setSelectedCruise(cruise)}
    >
      <h3>{cruise.destination}</h3>
      <p>Departure from: {cruise.departurePort}</p>
      <p>Leaving on: {cruise.leavingDate}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card selection on expand
          setExpandedCard((prev) => (prev === cruise.id ? null : cruise.id));
        }}
        className="expand-button"
      >
        {expandedCard === cruise.id ? "Hide Ports" : "Show Ports"}
      </button>
      {expandedCard === cruise.id && (
        <div className="ports">
          <h4>Ports of Call:</h4>
          <ul>
            {cruise.ports.map((port, index) => (
              <li key={index}>
                <strong>Day {port.day}:</strong> {port.location}
                {port.time && <span> ({port.time})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CruiseCard;
