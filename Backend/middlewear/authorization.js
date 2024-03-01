const connection = require("../models/db");
const authorization = (string) => {
    return function (req, res, next) {
        console.log(req.token);
      const user_id = req.token.userId;
      const data = [user_id];
      console.log("user_id",user_id);
      const query = `SELECT * FROM users WHERE id=?`;
      connection.query(query, data, (err, result) => {
        console.log(result + "jehad");
        const query = `SELECT * FROM role_permission INNER JOIN permissions ON role_permissions.permission_id= permissions.id WHERE role_permission.role_id = (?) AND permissions.permission = (?)`;

        console.log("result from user id", result[0].role_id);
        console.log(string);

        const data = [result[0].role_id, string];
        console.log("data", data);
        connection.query(query, data, (err, result) => {
          console.log("result", result);


          if (result) {
            next();
          } else {
            res.status(400).json({ message: "unauthorized" });
          }
        });
      });
    };
};

module.exports = authorization