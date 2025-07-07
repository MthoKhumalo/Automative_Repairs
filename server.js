const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = 5000;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Middleware
app.use(cors()); 
app.use(express.json());

// Database connection settings
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "cS4FJ?",
  database: "fixit",
  connectionLimit: 10,
});


/*AUTHENTICATION AND AUTHORIZATION SYSTEM*/
// 1. Validate username/password and return user details (USER LOGIN)
app.post("/api/login", (req, res) => {

  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {

    if (err) {

      console.error(err);
      return res.status(500).json({ error: "Failed to login." });
    }

    if (results.length > 0) {

      const user = results[0];

      res.json({

        user_id: user.user_id,
        username: user.username,
        role: user.role,
      });

    } else {

      res.status(401).json({ error: "Invalid credentials." });
    }

  });
});

// 2. Creates a new user in the database (USER REGISTRATION)
app.post("/api/register", (req, res) => {

  const { username, email, password, phone, role } = req.body;
  const safeRole = ['admin', 'user', 'pb'].includes(role) ? role : 'user';


  const query = `INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [username, email, password, phone, role], (err, results) => {

    if (err) {

      console.error(err);
      return res.status(500).json({ error: "Failed to register user." });
    }

    res.json({ message: "User registered successfully." });

  });
});
//END OF AUTHENTICATION AND AUTHORIZATION SYSTEM

/*FETCH PANEL BEATERS INFORMATION*/
app.get("/api/places", (req, res) => {

  const query = `
    SELECT p.*, u.username AS admin_name, u.email AS admin_email, u.phone AS admin_phone
    FROM places p
    JOIN users u ON p.admin_id = u.user_id
  `;

  db.query(query, (err, results) => {

    if (err) {

      console.error(err);
      return res.status(500).json({ error: "Failed to fetch places." });
    }

    res.json(results);

  });
});

// Fetch places by type
app.get("/api/places/type", (req, res) => {
  const { type } = req.query;
  if (!type) return res.status(400).json({ error: "Missing type parameter" });

  const query = `SELECT * FROM places WHERE FIND_IN_SET(?, type) > 0`;

  db.query(query, [type], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch places by type." });
    }
    res.json(results);
  });
});

//places 2.0
app.get("/api/places/types", (req, res) => {
  const query = `SELECT DISTINCT type FROM places`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch place types." });
    res.json(results.map(row => row.type));
  });
});


// Fetch nearby places using Haversine
app.get("/api/places/nearby", (req, res) => {
  const { latitude, longitude, radius = 5000 } = req.query;
  const query = `
    SELECT id, name, type, latitude, longitude, address, description,
           (6371 * acos(
               cos(radians(?)) * cos(radians(latitude)) *
               cos(radians(longitude) - radians(?)) +
               sin(radians(?)) * sin(radians(latitude))
           )) AS distance
    FROM places
    HAVING distance <= ? / 1000
    ORDER BY distance ASC
  `;

  db.query(query, [latitude, longitude, latitude, radius], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch nearby places." });
    res.json(results);
  });
});



//END

/*GOOGLE MAPS API START*/
// 1. Check database connection status
app.get("/api/dbstatus", (req, res) => {
  db.connect((err) => {

    if (err) {

      console.error("Database connection failed:", err.message);
      return res.status(500).send({ status: "disconnected", error: err.message });
    }

    console.log("Database connected successfully");

    return res.status(200).send({ status: "connected" });

  });
});

// 2. Proxy for Google Maps Text Search API
app.get("/api/textsearch", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query,
          key: GOOGLE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error in Text Search API Proxy:", error);
    res.status(500).send("Error fetching data from Google Maps API");
  }
});

// 3. Proxy for Google Maps Nearby Search API
app.get("/api/nearby", async (req, res) => {
  const { location, radius, type } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location,
          radius,
          type,
          key: GOOGLE_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error in Nearby Search API Proxy:", error);
    res.status(500).send("Error fetching data from Google Maps API");
  }
}); 
//GOOGLE MAPS API END

/*CHAT SYSTEM API START*/
// 1. Get all conversations for a user
app.get("/api/conversations/:userId", (req, res) => {

  const userId = req.params.userId;

  const query = `
    SELECT * FROM conversations
    WHERE initiator_id = ? OR participant_id = ?
  `;

  db.query(query, [userId, userId], (err, results) => {

    if (err) {

      console.error(err);
      res.status(500).json({ error: "Failed to fetch conversations.", details: err.message });

    } else {

      res.json(results);
    }

  });
});

//1.2 post conversations
// Create a new conversation if it doesn't exist
app.post("/api/conversations", (req, res) => {
  const { initiator_id, participant_id } = req.body;

  if (!initiator_id || !participant_id) {
    return res.status(400).json({ error: "Both initiator_id and participant_id are required.", details: err.message });
  }

  const checkQuery = `
    SELECT * FROM conversations
    WHERE (initiator_id = ? AND participant_id = ?)
       OR (initiator_id = ? AND participant_id = ?)
  `;

  db.query(checkQuery, [initiator_id, participant_id, participant_id, initiator_id], (err, results) => {
    if (err) {
      console.error("Database error on SELECT:", err);
      return res.status(500).json({ error: "Database error while checking existing conversation." });
    }

    if (results.length > 0) {
      return res.json({
        conversation_id: results[0].conversation_id,
        existing: true
      });
    }

    const insertQuery = `
      INSERT INTO conversations (initiator_id, participant_id, created_at)
      VALUES (?, ?, NOW())
    `;

    db.query(insertQuery, [initiator_id, participant_id], (err, insertResults) => {
      if (err) {
        console.error("Database error on INSERT:", err);
        return res.status(500).json({ error: "Failed to create conversation." });
      }

      const newConversationId = insertResults.insertId;

      if (!newConversationId) {
        return res.status(500).json({ error: "Conversation created but ID not returned.", details: err.message });
      }

      res.json({
        conversation_id: newConversationId,
        existing: false
      });
    });
  });
});

//1.2 get conversations using conversationid
// GET /api/conversation/123   (singular)
app.get("/api/conversation/:conversationId", (req, res) => {
  const conversationId = req.params.conversationId;
  const sql = "SELECT * FROM conversations WHERE conversation_id = ?";
  db.query(sql, [conversationId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error", details: err });
    if (!rows.length)
      return res.status(404).json({ error: "Conversation not found" });
    res.json(rows[0]);       // single object – exactly what Chat.jsx expects
  });
});


// 2. Get messages for a specific conversation
app.get("/api/messages/:conversationId", (req, res) => {

  const conversationId = req.params.conversationId;

  const query = `
    SELECT * FROM messages WHERE conversation_id = ?
    ORDER BY timestamp DESC
  `;

  db.query(query, [conversationId], (err, results) => {

    if (err) {

      console.error(err);
      res.status(500).json({ error: "Failed to fetch messages.", details: err.message });

    } else {

      res.json(results);
    }

  });
});

// 3. Send a new message (with conversation check/create logic)
app.post("/api/messages", (req, res) => {
  const { conversation_id, sender_id, receiver_id, message_content } = req.body;

  if (!sender_id || !receiver_id || !message_content) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const insertMessage = (convId) => {
    const insertMessageQuery = `
      INSERT INTO messages (conversation_id, sender_id, receiver_id, message_content, timestamp, is_read)
      VALUES (?, ?, ?, ?, NOW(), 0)
    `;
    db.query(insertMessageQuery, [convId, sender_id, receiver_id, message_content], (err, msgResults) => {
      if (err) {
        console.error("Error inserting message:", err);
        return res.status(500).json({ error: "Failed to send message.", details: err.message });
      }

      res.status(201).json({ message: "Message sent successfully." });
    });
  };

  if (conversation_id) {
    insertMessage(conversation_id);
  } else {
    const checkConversationQuery = `
      SELECT * FROM conversations
      WHERE (initiator_id = ? AND participant_id = ?)
         OR (initiator_id = ? AND participant_id = ?)
    `;

    db.query(checkConversationQuery, [sender_id, receiver_id, receiver_id, sender_id], (err, results) => {
      if (err) {
        console.error("Database error on SELECT:", err);
        return res.status(500).json({ error: "Database error checking conversation.", details: err.message });
      }

      if (results.length > 0) {
        // Existing conversation found
        insertMessage(results[0].conversation_id);
      } else {
        // No conversation found, create a new one
        const createConversationQuery = `
          INSERT INTO conversations (initiator_id, participant_id, last_message_timestamp)
          VALUES (?, ?, NOW())
        `;
        db.query(createConversationQuery, [sender_id, receiver_id], (err, convResults) => {
          if (err) {
            console.error("Error creating conversation:", err);
            return res.status(500).json({ error: "Failed to create conversation.", details: err.message });
          }

          insertMessage(convResults.insertId);
        });
      }
    });
  }
});



/* 4. Create a new conversation
app.get("/api/conversations/:userId", (req, res) => {
  const userId = req.params.userId;
  
  console.log("Fetching conversations for user ID:", userId);

  const query = `
    SELECT * FROM conversations
    WHERE initiator_id = ? OR participant_id = ?
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching conversations:", err);
      return res.status(500).json({ error: "Failed to fetch conversations." });
    }

    console.log("Conversations fetched:", results);
    res.json(results);
  });
});*/


// 5. Get user details by user ID
app.get("/api/users/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `SELECT user_id, username, email FROM users WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    
    if (err) {

      console.error(err);
      res.status(500).json({ error: "Failed to fetch user details." });

    } else if (results.length === 0) {

      res.status(404).json({ error: "User not found.", details: err.message });

    } else {

      res.json(results[0]); // Return the first result (should be only one user)
    }

  });
});

//CHAT SYSTEM API END


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
