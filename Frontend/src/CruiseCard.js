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
        selectedCruise?.trip_id === cruise.trip_id ? "selected" : ""
      }`}
      onClick={() => setSelectedCruise(cruise)}
    >
      <h3 className="cruise-name">{cruise.ship_name}</h3>
      <div className="cruise-details">
        <p><strong>Departure Port:  </strong> {cruise.start_port}</p>
        <p><strong>Arrival Port:  </strong> {cruise.end_port}</p>
        <p><strong>Departure Date:  </strong> {cruise.start_date}</p>
        <p><strong>Arrival Date:  </strong> {cruise.end_date}</p>
      </div>
    </div>
  );
};

export default CruiseCard;
