import React, { useEffect, useState } from 'react';
import AiChatbox from './AiChatBox';
import axios from './api';

const CruiseShipIcon = ({ style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    style={{
      width: '50px',
      height: '50px',
      fill: 'white',
      ...style
    }}
  >
    <path d="M80 60c-5.523 0-10 4.477-10 10v10H30V70c0-5.523-4.477-10-10-10H10c-5.523 0-10 4.477-10 10v10c0 5.523 4.477 10 10 10h60c5.523 0 10-4.477 10-10V70c0-5.523-4.477-10-10-10z"/>
    <path d="M90 40H10c-5.523 0-10 4.477-10 10v10h100V50c0-5.523-4.477-10-10-10z"/>
    <path d="M70 20H30c-5.523 0-10 4.477-10 10v10h60V30c0-5.523-4.477-10-10-10z"/>
    <circle cx="50" cy="15" r="5"/>
  </svg>
);

const AIChatCircle = ({ tripId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [initialOverview, setInitialOverview] = useState('');
  const [chatHints, setChatHints] = useState([]);

  // Fetch trip details and generate overview
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/detailed-trips/${tripId}/`);
        const details = response.data;
        setTripDetails(details);

        // Generate initial overview
        const overview = `
          Cruise Overview:
          🚢 Ship: ${details.trip_info.ship_name}
          📅 Dates: ${details.trip_info.start_date} to ${details.trip_info.end_date}
          🌍 Route: From ${details.trip_info.start_port} to ${details.trip_info.end_port}
          👥 Passengers: ${details.trip_info.number_passengers}
        `;
        setInitialOverview(overview);

        // Generate chat hints
        const hints = [
          `Ask about ports like ${details.ports.map(p => p.port_name).join(', ')}`,
          'Inquire about onboard entertainments',
          'Learn about available dining options',
          'Get details on trip packages',
          'Explore ship amenities'
        ];
        setChatHints(hints);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  // Floating circle style
  const circleStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'all 0.3s ease'
  };

  const modalStyle = {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '350px',
    maxHeight: '80vh',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1001,
    padding: '20px',
    overflowY: 'auto'
  };

  const hintStyle = {
    backgroundColor: 'rgba(0,123,255,0.1)',
    margin: '5px 0',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  return (
    <>
      {/* Floating Circle */}
      <div 
        style={circleStyle} 
        onClick={() => setIsOpen(!isOpen)}
        title="AI Cruise Assistant"
      >
        <CruiseShipIcon />
      </div>

      {/* Modal/Popup */}
      {isOpen && tripDetails && (
        <div style={modalStyle}>
          {/* Initial Overview */}
          <div style={{ 
            marginBottom: '15px', 
            borderBottom: '1px solid #eee',
            paddingBottom: '10px'
          }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>
              Your Cruise Journey
            </h3>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit',
              backgroundColor: 'rgba(0,123,255,0.05)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              {initialOverview}
            </pre>
          </div>

          {/* Chat Hints */}
          <div>
            <h4 style={{ color: '#007bff' }}>What Can I Help You With?</h4>
            {chatHints.map((hint, index) => (
              <div 
                key={index} 
                style={hintStyle}
                onClick={() => {
                  // Optional: You could pre-fill the chat with this hint
                  console.log(`Hint clicked: ${hint}`);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,123,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,123,255,0.1)';
                }}
              >
                • {hint}
              </div>
            ))}
          </div>

          {/* Actual Chatbox */}
          <AiChatbox 
            tripId={tripId} 
            initialContext={initialOverview}
          />
        </div>
      )}
    </>
  );
};

export default AIChatCircle;
