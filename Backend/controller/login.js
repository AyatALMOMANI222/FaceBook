const connection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const login = (req, res) => {
  const {email,password} = req.body;
  const query = `
    SELECT users.user_id, users.username, users.email, roles.role_name, users.password,users.profile_picture
    FROM users
    LEFT JOIN user_role ON users.user_id = user_role.user_id
    LEFT JOIN roles ON user_role.role_id = roles.role_id
    WHERE users.email = ?`;

  const data = [email , password];
  connection.query(query, data, async (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching user data.",
      });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "The email doesn't exist",
      });
      return;
    }

    const user = result[0];
console.log(user);
console.log(user.password);
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const userPayload = {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          profile_picture : user.profile_picture
          
        };

        const rolePayload = {
          role_name: user.role_name
        };

        const userToken = jwt.sign(userPayload, process.env.SECRET);

        res.status(200).json({
          success: true,
          userToken,
          user_id: user.user_id,
          username: user.username,
          profile_picture : user.profile_picture
        });
      } else {
        res.status(403).json({
          success: false,
          message: "The password you’ve entered is incorrect",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while comparing passwords.",
      });
    }
  });
};

module.exports = login;
