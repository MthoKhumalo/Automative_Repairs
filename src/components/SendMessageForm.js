import React, { useState } from "react";
import '../CSS/ChatSystem.css'; 

const SendMessageForm = ({ conversationId, receiverId, onMessageSent }) => {
  const [messageContent, setMessageContent] = useState("");

  // Fetch userId dynamically from localStorage
  const senderId = JSON.parse(localStorage.getItem("user"))?.user_id;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!senderId) {
      console.error("User ID is not available. Cannot send message.");
      return;
    }

    fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        message_content: messageContent,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        onMessageSent();
        setMessageContent("");
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  return (
    <form className="send-message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessageForm;
