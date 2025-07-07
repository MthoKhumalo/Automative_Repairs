import React, { useEffect, useState, useRef } from "react";
import '../CSS/ChatSystem.css';

const MessageWindow = ({ conversationId, refreshTrigger }) => {
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId || !userId) return;

    fetch(`http://localhost:5000/api/messages/${conversationId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);

        const userIds = [
          ...new Set(data.flatMap((msg) => [msg.sender_id, msg.receiver_id])),
        ];

        Promise.all(
          userIds.map((id) =>
            fetch(`http://localhost:5000/api/users/${id}`)
              .then((res) => res.json())
              .then((user) => ({ id, name: user.username }))
          )
        )
          .then((userData) => {
            const namesMap = {};
            userData.forEach(({ id, name }) => {
              namesMap[id] = name;
            });
            setUserNames(namesMap);
          })
          .catch((error) =>
            console.error("Error fetching user names:", error)
          );
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [conversationId, userId, refreshTrigger]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-window">
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.message_id}
            className={`message ${
              message.sender_id === userId
                ? "receiver-message"
                : "sender-message"
            }`}
          >
            <div className="message-content">{message.message_content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageWindow;
