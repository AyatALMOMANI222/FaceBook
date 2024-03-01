const connection = require("../models/db");

const createComment = (req, res) => {
  const { user_id, post_id, comment_text } = req.body;

  const sql = `INSERT INTO comments (user_id, post_id, comment_text) VALUES (?, ?, ?)`;
  connection.query(sql, [user_id, post_id, comment_text], (err, result) => {
    if (err) {
      console.error("Error creating comment:", err);
      return res.status(500).json({ message: "Failed to create comment" });
    }
    const comment_id = result.insertId;
    console.log("Comment created successfully", post_id, user_id, comment_id);
    res.status(201).json({ message: "Comment created successfully", result });
  });
};

const getCommentsByPostId = (req, res) => {
  const { post_id } = req.params;
  const getQuery = `
        SELECT * 
        FROM comments c
        INNER JOIN users u ON (c.user_id = u.user_id )
        WHERE post_id = ?
      `;

  connection.query(getQuery, [post_id], (err, comments) => {
    if (err) {
      console.error("Error fetching comments by post ID:", err);
      return res.status(500).json({ message: "Failed to fetch comments" });
    }
    res.status(200).json({ comments });
  });
};
const getComments = (req, res) => {
  const getQuery = `
        SELECT * 
        FROM comments c
        INNER JOIN users u ON (c.user_id = u.user_id )
      `;

  connection.query(getQuery, [], (err, comments) => {
    if (err) {
      console.error("Error fetching comments", err);
      return res.status(500).json({ message: "Failed to fetch comments" });
    }
    res.status(200).json({ comments });
  });
};

const deleteCommentById = (req, res) => {
  const { comment_id } = req.params; // تفترض وجود comment_id و user_id في الباراماترات
  const { user_id } = req.body;
  const deleteQuery = `
    DELETE FROM comments
    WHERE comment_id = ? AND user_id = ?
  `;

  connection.query(deleteQuery, [comment_id, user_id], (err, result) => {
    if (err) {
      console.error("Error deleting comment:", err);
      return res.status(500).json({ message: "Failed to delete comment" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized to delete" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  });
};

module.exports = { createComment, getCommentsByPostId, deleteCommentById , getComments };
