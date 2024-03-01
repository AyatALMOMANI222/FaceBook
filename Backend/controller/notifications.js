const connection = require("../models/db");

const createNotification = (req, res) => {
  const { user_id, notification_type, item_id, message } = req.body;
  // تنفيذ استعلام SQL لإنشاء إشعار جديد
  const sql = `INSERT INTO notifications (user_id, notification_type, item_id, message) VALUES (?, ?, ?, ?)`;
  connection.query(
    sql,
    [user_id, notification_type, item_id, message],
    (err, result) => {
      if (err) {
        console.error(`Error creating ${notification_type} notification:`, err);
        return res.status(500).json({
          message: `Failed to create ${notification_type} notification`,
          error: err,
        });
      }
      console.log(`${notification_type} notification created successfully`);
      res.status(201).json({
        message: `${notification_type} notification created successfully`,
      });
    }
  );
};

const getAllNotifications = (req, res) => {
  const sql = `SELECT message, is_read, created_at, item_id, notification_type, notification_id, n.user_id, username, profile_picture FROM notifications n INNER JOIN users u ON n.user_id = u.user_id`;

  connection.query(sql, (error, notifications) => {
    if (error) {
      console.error("Failed to fetch notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    } else {
      console.log("Fetched notifications:", notifications);
      res.status(200).json({ notifications });
    }
  });
};

module.exports = { createNotification, getAllNotifications };
