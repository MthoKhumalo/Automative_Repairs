import React, { useEffect, useState } from "react";
import '../CSS/ChatSystem.css';

const ConversationList = ({ selectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({}); 

  // Fetch userId dynamically from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

  useEffect(() => {

    console.log("User ID in frontend:", userId); // Debug log

    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    fetch(`http://localhost:5000/api/conversations/${userId}`)
      .then((response) => response.json())
      .then((data) => {

        console.log("Fetched conversations:", data);
        setConversations(data);
        const userIds = [...new Set(data.map((conv) =>conv.initiator_id === userId ? conv.participant_id : conv.initiator_id))];

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
      .catch((error) => console.error("Error fetching conversations:", error));
  }, [userId]);

  return (
    <div className="conversation-list">
      <h3>Conversations</h3>
      {conversations.map((conversation) => {
        const otherUserId =
          conversation.initiator_id === userId
            ? conversation.participant_id
            : conversation.initiator_id;

        return (
          <div
            key={conversation.conversation_id}
            onClick={() => selectConversation(conversation.conversation_id)}
            style={{ cursor: "pointer", padding: "5px 0" }}
          >
            Conversation with {userNames[otherUserId] || "Loading..."}
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
