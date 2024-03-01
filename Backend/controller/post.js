const connection = require("../models/db");

const createPost = (req, res) => {
  const {
    user_id,
    content,
    visibility,
    photo,
    likes_count,
    comments_count,
    shares_count,
  } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.token.userId;
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!قيمة التوكن
  if (!content) {
    return res.status(400).json({ message: "Content is required fields" });
  }

  const sql = `INSERT INTO posts (user_id ,content, visibility, photo, likes_count, comments_count, shares_count) VALUES (?,?, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      user_id,
      content,
      visibility || "public",
      photo || "",
      likes_count || 0,
      comments_count || 0,
      shares_count || 0,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ message: "Failed to create post" });
      }
      console.log(token);
      console.log("Post created successfully");
      console.log(userId);
      res.status(201).json({
        message: "Post created successfully",
        postId: result.insertId,
      });
    }
  );
};

const createPostByUserId = (req, res) => {
  const user_id = req.params.user_id;
  const {
    content,
    photo,

    likes_count,
    comments_count,
    shares_count,
  } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const userId = req.token.userId;
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!قيمة التوكن
  if (!content) {
    return res.status(400).json({ message: "Content is required fields" });
  }

  const sql = `INSERT INTO posts (user_id ,content, photo, likes_count, comments_count, shares_count) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      user_id,
      content,
      // visibility || "public",
      photo || "",
      likes_count || 0,
      comments_count || 0,
      shares_count || 0,
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ message: "Failed to create post" });
      }
      console.log(token);
      console.log("Post created successfully");
      console.log(userId);
      res.status(201).json({
        message: "Post created successfully",
        postId: result.insertId,
      });
    }
  );
};

const getAllPosts = (req, res) => {
  const sql =
    "SELECT * FROM posts p INNER JOIN users u ON (p.user_id = u.user_id )";

  connection.query(sql, (error, users) => {
    if (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    } else {
      console.log("Fetched users:", users);
      res.status(200).json({ users });
    }
  });
};
const getPostsByUserId = (req, res) => {
  const user_id = req.params.user_id;
  const sql = "SELECT * FROM posts WHERE user_id=?";

  connection.query(sql, [user_id], (error, posts) => {
    if (error) {
      console.error("Failed to fetch postUser:", error);
      res.status(500).json({ message: "Failed to fetch postUser" });
    } else {
      console.log("Fetched posts:", posts);
      res.status(200).json({ posts });
    }
  });
};

const deletePostbyId = (req, res) => {
  const post_id = req.params.id;

  const sql = "DELETE FROM posts WHERE post_id = ?";

  connection.query(sql, [post_id], (error, result) => {
    if (error) {
      console.error("Failed to delete post data:", error);
      return res.status(500).json({ message: "Failed to delete post data" });
    }

    console.log("post data deleted successfully");
    res.status(200).json({ message: "post data deleted successfully" });
  });
};

const updatePost = (req, res) => {
  const { content, photo } = req.body;
  const post_id = req.params.id;
  const sql = "UPDATE posts set content=?,photo=? WHERE post_id=? ";
  connection.query(sql, [content, photo, post_id], (err, result) => {
    if (err) {
      console.error("Error updating post:", err);
      return res.status(500).json({ message: "Failed to update post" });
    }
    console.log("Post updated successfully");
    res.status(200).json({ message: "Post updated successfully" });
  });
};

const getPostById = (req, res) => {
  const post_id = req.params.id;

  const sql = "SELECT * FROM posts WHERE post_id = ?";

  connection.query(sql, post_id, (error, post) => {
    if (error) {
      console.error("Failed to fetch post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    } else {
      if (post.length === 0) {
        res.status(404).json({ message: "Post not found" });
      } else {
        console.log("Fetched post:", post);
        res.status(200).json({ post });
      }
    }
  });
};

const deleteCommentById = (req, res) => {
  const { comment_id, user_id } = req.params; // تفترض وجود comment_id و user_id في الباراماترات

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

module.exports = {
  createPost,
  getAllPosts,
  deletePostbyId,
  updatePost,
  getPostsByUserId,
  createPostByUserId,
  getPostById,
};
