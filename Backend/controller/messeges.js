const connection = require("../models/db");

let socketIO;
function setupSocket(io) {
  socketIO = io;

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("privateMessage", (data) => {
      const { sender_id, receiver_id, message_text } = data;
      socket.broadcast.emit(`privateMessage_${receiver_id}`, {
        sender_id,
        message_text ,
      });
    });
  });
}

// Function to create a message
const createMessage = (req, res) => {
  const { sender_id, receiver_id, message_text } = req.body;
  // Assuming 'connection' is your MySQL database connection
  const sql = `INSERT INTO private_messages (sender_id, receiver_id, message_text) VALUES (?, ?, ? )`;
  connection.query(
    sql,
    [sender_id, receiver_id, message_text],
    (err, result) => {
      if (err) {
        console.error("Error creating message:", err);
        return res.status(500).json({ message: "Failed to create message" });
      }
      const message_id = result.insertId;
      console.log("Message created successfully", message_id);
      res.status(201).json({ message: "Message created successfully", result });
    }
  );
};




const getMessagesBetweenTwoPerson = (req, res) => {
  const { other_user_id, user_id } = req.params;
  
  const sql =`
    SELECT pm.message_id, pm.sender_id, sender.username AS sender_username, 
           pm.receiver_id, receiver.username AS receiver_username,
           pm.message_text, pm.sent_at
    FROM private_messages AS pm
    INNER JOIN users AS sender ON pm.sender_id = sender.user_id
    INNER JOIN users AS receiver ON pm.receiver_id = receiver.user_id
    WHERE 
      (pm.sender_id = ? AND pm.receiver_id = ?) 
      OR 
      (pm.sender_id = ? AND pm.receiver_id = ?) 
    ORDER BY pm.sent_at`;
 

  connection.query(
    sql,
    [user_id, other_user_id, other_user_id, user_id],
    (err, messages) => {
      if (err) {
        console.error("Error fetching messages:", err);
        return res.status(500).json({ message: "Failed to fetch messages" });
      }
      res.status(200).json({ messages });
    }
  );
};


const deleteConverBetTwoPerson = (req, res) => {
  const { user1Id, user2Id } = req.body;
  const deleteQuery = `
      DELETE FROM private_messages 
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    `;

  connection.query(
    deleteQuery,
    [user1Id, user2Id, user2Id, user1Id],
    (err, result) => {
      if (err) {
        console.error("Error deleting conversation:", err);
        return res
          .status(500)
          .json({ message: "Failed to delete conversation" });
      }
      console.log("Conversation deleted successfully");
      res.status(200).json({ message: "Conversation deleted successfully" });
    }
  );
};

const deleteAllConversationsWithUser = (req, res) => {
  const { userId } = req.body;
  const deleteQuery = `
      DELETE FROM private_messages 
      WHERE sender_id = ? OR receiver_id = ?
    `;

  connection.query(deleteQuery, [userId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting conversations:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete conversations" });
    }
    console.log("Conversations deleted successfully");
    res.status(200).json({ message: "Conversations deleted successfully" });
  });
};

const getAllConversations = (req, res) => {
  const { userId } = req.body;
  const getQuery = `
      SELECT * 
      FROM private_messages
      WHERE sender_id = ? OR receiver_id = ?
    `;

  connection.query(getQuery, [userId, userId], (err, conversations) => {
    if (err) {
      console.error("Error fetching conversations:", err);
      return res.status(500).json({ message: "Failed to fetch conversations" });
    }
    res.status(200).json({ conversations });
  });
};

const getReceivedMessages = (req, res) => {
  const { userId } = req.body;
  const getQuery = `
      SELECT * 
      FROM private_messages
      WHERE receiver_id = ?
    `;

  connection.query(getQuery, [userId], (err, receivedMessages) => {
    if (err) {
      console.error("Error fetching received messages:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch received messages" });
    }
    res.status(200).json({ receivedMessages });
  });
};

const updateMessage = (req, res) => {
  const { updatedMessage, message_id, user_id } = req.body;

  const updateQuery = `
      UPDATE private_messages
      SET message_text = ?
      WHERE message_id = ? AND sender_id = ?
    `;

  connection.query(
    updateQuery,
    [updatedMessage, message_id, user_id],
    (err, result) => {
      if (err) {
        console.error("Error updating message:", err);
        return res.status(500).json({ message: "Failed to update message" });
      }
      console.log("Message updated successfully");
      res.status(200).json({ message: "Message updated successfully" });
    }
  );
};

const deleteMessageBySenderId = (req, res) => {
  const { message_id, user_id } = req.body;

  const deleteQuery = `
      DELETE FROM private_messages 
      WHERE message_id = ? AND sender_id = ?
    `;

  connection.query(deleteQuery, [message_id, user_id], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ message: "Failed to delete message" });
    }
    console.log("Message deleted successfully");
    res.status(200).json({ message: "Message deleted successfully" });
  });
};

module.exports = {
  setupSocket,
  createMessage,
  getMessagesBetweenTwoPerson,
  deleteConverBetTwoPerson,
  deleteAllConversationsWithUser,
  getAllConversations,
  getReceivedMessages,
  updateMessage,
  deleteMessageBySenderId,
};
