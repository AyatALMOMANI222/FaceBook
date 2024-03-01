const connection = require("../models/db");
const bcrypt = require("bcrypt");

const createUser = (req, res) => {
  const {
    username,
    email,
    country,
    city,
    password,
    date_of_birth,
    bio,
    profile_picture,
    cover_photo,
    location,
  } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Failed to create user" });
    }

    // الاستعلام إلى قاعدة البيانات مع hashedPassword بدلاً من password
    const sql = `INSERT INTO users (username, email,password, country, city, date_of_birth,  bio, profile_picture, cover_photo, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    connection.query(
      sql,
      [
        username,
        email,
        hashedPassword,
        country,
        city,
        date_of_birth,
        bio,
        profile_picture,
        cover_photo,
        location,
      ],
      (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Failed to create user" });
        }
        console.log("User created successfully");
        res.status(201).json({
          message: "User created successfully",
          userId: result.insertId,
        });
      }
    );
  });
};

const updateUser = (req, res) => {
 let userId = req.token.user_id;
  const {
    username,
    country,
    city,
    date_of_birth,
    bio,
    profile_picture,
    cover_photo,
    location,
  } = req.body;

  const sql =
    "UPDATE users set username=?,country=?, city=?, date_of_birth=?,bio=?, profile_picture=?, cover_photo=?,location=? WHERE user_id=? ";
  connection.query(
    sql,
    [
      username,
      country,
      city,
      date_of_birth,
      bio,
      profile_picture,
      cover_photo,
      location,
      userId
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "Failed to update user" });
      }
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
      console.log(userId);
    }
  );
};

const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";

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
const getAllUsersExceptCurrent = (req, res) => {
  const userId = req.token.user_id; // استخراج معرف المستخدم من التوكن
  
  const sql = `SELECT * FROM users WHERE user_id <> ?`; // استعلام يُستبعد المستخدم الحالي
  
  connection.query(sql, [userId], (error, users) => {
    if (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    } else {
      console.log("Fetched users:", users);
      res.status(200).json({ users });
    }
  });
};


const getUserById = (req, res) => {
  const user_id = req.params.user_id;
  const sql = "SELECT * FROM users WHERE user_id=?";

  connection.query(sql, [user_id], (error, users) => {
    if (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    } else {
      console.log("Fetched users:", users);
      res.status(200).json({ users });
    }
  });
};

const deleteUserById = (req, res) => {
  const user_id = req.params.user_id; // قراءة معرف المستخدم الذي تريد حذف بياناته

  const sql = "DELETE FROM users WHERE user_id = ?"; // استعلام الحذف

  connection.query(sql, [user_id], (error, result) => {
    if (error) {
      console.error("Failed to delete user data:", error);
      return res.status(500).json({ message: "Failed to delete user data" });
    }

    console.log("User data deleted successfully");
    res.status(200).json({ message: "User data deleted successfully" });
  });
};

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  deleteUserById,
  getUserById,
  getAllUsersExceptCurrent
};
