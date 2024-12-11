import OpenAI from 'openai';
import React, { useEffect, useState } from 'react';
import axios from './api';

const api_key="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"

const AiChatbox = ({ tripId, initialContext = '' }) => {
  const [tripDetails, setTripDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  // Initialize OpenAI client with a proxy approach
  const openai = new OpenAI({
    apiKey: api_key,
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.openai.com/v1' // Explicit base URL
  });

  // Fetch trip details when component mounts
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/detailed-trips/${tripId}/`);
        setTripDetails(response.data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
        setMessages(prev => [...prev, {
          text: "Unable to load trip details. Please try again.",
          sender: 'ai'
        }]);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  // Prepare comprehensive context for AI
  const getContextualPrompt = () => {
    const tripContext = `
      ${initialContext}

      Trip Context:
      - Ship: ${tripDetails.trip_info.ship_name}
      - Dates: ${tripDetails.trip_info.start_date} to ${tripDetails.trip_info.end_date}
      - Passenger Capacity: ${tripDetails.trip_info.number_passengers}

      Ports of Call:
      ${tripDetails.ports.map(port => `
        - ${port.port_name} (${port.arrival_date}):
          * Location: ${port.address.address_line1}, ${port.address.city}, ${port.address.state}, ${port.address.country}
          * Airport: ${port.airport}
      `).join('\n')}

      Onboard Amenities:
      Entertainments:
      ${tripDetails.entertainments.map(ent => 
        `- ${ent.entertainment_name} (Age Limit: ${ent.age_limit}+, Floor: ${ent.floor})`
      ).join('\n')}

      Restaurants:
      ${tripDetails.restaurants.map(rest => 
        `- ${rest.restaurant_name} (Open: ${rest.opening_time}-${rest.closing_time}, Floor: ${rest.floor})`
      ).join('\n')}

      Available Packages:
      ${tripDetails.packages.map(pkg => 
        `- ${pkg.package_name}: $${pkg.package_price} (${pkg.price_type}) - ${pkg.description}`
      ).join('\n')}
    `;
    return tripContext;
  };

  // Send message to OpenAI
  const sendMessage = async () => {
    if (!newMessage.trim() || !tripDetails) return;

    // Add user message to chat
    const userMessage = { text: newMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system", 
            content: `You are a helpful AI cruise assistant providing information about a specific cruise trip. 
            Use the following context to provide informative and engaging responses:
            ${getContextualPrompt()}`
          },
          { 
            role: "user", 
            content: newMessage 
          }
        ],
        max_tokens: 200
      });

      // Extract AI response
      const aiMessage = {
        text: response.choices[0].message.content.trim(),
        sender: 'ai'
      };

      // Add AI message to chat
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in AI chat:", error);
      const errorMessage = {
        text: "Sorry, I'm having trouble processing your request right now.",
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render method
  const renderChatbox = () => {
    if (!tripDetails) {
      return <div>Loading trip details...</div>;
    }

    return (
      <div className="ai-chatbox" style={{
        width: '100%',
        maxWidth: '500px',
        margin: '20px auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '20px'
      }}>
        <h3 style={{
          color: '#007bff',
          textAlign: 'center',
          marginBottom: '15px'
        }}>
          AI Cruise Assistant for {tripDetails.trip_info.ship_name}
        </h3>

        {/* Chat Messages Display */}
        <div className="chat-messages" style={{
          height: '300px',
          overflowY: 'auto',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: 'rgba(240, 240, 240, 0.5)',
          borderRadius: '8px'
        }}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '10px 0',
                padding: '10px',
                backgroundColor: msg.sender === 'user' ? 'rgba(0, 123, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '8px',
                maxWidth: '80%',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div style={{
              textAlign: 'left',
              fontStyle: 'italic',
              color: '#888'
            }}>
              AI is typing...
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input" style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your cruise..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginRight: '10px'
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !tripDetails}
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  return renderChatbox();
};

export default AiChatbox;
