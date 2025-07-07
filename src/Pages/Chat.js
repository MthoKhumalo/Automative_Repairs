import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from '../components/Header';
import ConversationList from "../components/ConversationList";
import MessageWindow from "../components/MessageWindow";
import SendMessageForm from "../components/SendMessageForm";
import '../CSS/ChatSystem.css';

const Chat = () => {
  const location = useLocation();
  const initialConversationId = location.state?.conversationId || null;

  const [selectedConversationId, setSelectedConversationId] = useState(initialConversationId);
  const [receiverId, setReceiverId] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

  // Fetch receiver based on selected conversation
  useEffect(() => {
    const fetchReceiverId = async () => {
      if (!selectedConversationId || !userId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/conversation/${selectedConversationId}`);
        const data = await res.json();

        // Identify the other participant
        const receiver = data.initiator_id === userId ? data.participant_id : data.initiator_id;
        setReceiverId(receiver);
      } catch (err) {
        console.error("Failed to fetch conversation details:", err);
      }
    };

    fetchReceiverId();
  }, [selectedConversationId, userId]);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageSent = () => {
    
    // Trigger refresh in MessageWindow
    setSelectedConversationId((id) => id);
    setRefreshKey((prev) => prev + 1);

  };

  return (
    <>
      <Header />

      <div className="chat-container">
        <ConversationList selectConversation={setSelectedConversationId} />
        
        {selectedConversationId ? (
          <div className="message-window">
            <MessageWindow conversationId={selectedConversationId} refreshTrigger={refreshKey} />
            {receiverId && (
              <SendMessageForm
                conversationId={selectedConversationId}
                senderId={userId}
                receiverId={receiverId}
                onMessageSent={handleMessageSent}
              />
            )}
          </div>
        ) : (
          <div className="message-window">Select a conversation to start chatting.</div>
        )}
      </div>
    </>
  );
};

export default Chat;
