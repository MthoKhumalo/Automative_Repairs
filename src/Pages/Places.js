import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import "../CSS/Places.css";

const Places = () => {
  const { user } = useContext(AuthContext);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "pb") {
      alert("Access denied: Panel Beaters cannot access this page.");
      navigate("/home");
      return;
    }

    fetch("http://localhost:5000/api/places")
      .then((res) => res.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching places:", err);
        setPlaces([]);
      });
  }, [user, navigate]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

  const handleStartChat = async () => {
    if (!selectedPlace) return;
    const currentUserId = user?.user_id;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: selectedPlace.admin_id,
          receiver_id: currentUserId,
          message_content: "Hi, how can I assist you?",
        }),
      });

      const data = await res.json();
      if (data.conversation_id) {
        navigate("/chat", { state: { conversationId: data.conversation_id } });
      } else {
        console.error("No conversation ID returned.");
      }
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="places-container">
        <h2>Panel Beater Locations</h2>
        <div className="places-grid">
          {places.map((place) => (
            <div key={place.id} className="place-box" onClick={() => handleSelectPlace(place)}>
              <h3>{place.name}</h3>
              <p>Type: {place.type}</p>
            </div>
          ))}
        </div>

        {selectedPlace && (
          <div className="place-details">
            <h3>{selectedPlace.name}</h3>
            <p><strong>Type:</strong> {selectedPlace.type}</p>
            <p><strong>Address:</strong> {selectedPlace.address}</p>
            <p><strong>Description:</strong> {selectedPlace.description}</p>
            <p><strong>Latitude:</strong> {selectedPlace.latitude}</p>
            <p><strong>Longitude:</strong> {selectedPlace.longitude}</p>
            <p><strong>Panel Beater Contact:</strong></p>
            <p>Email: {selectedPlace.admin_email}</p>
            <p>Phone: {selectedPlace.admin_phone}</p>

            <button className="start-chat-btn" onClick={handleStartChat}>
              Start Chat (+)
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Places;
