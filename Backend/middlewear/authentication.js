const jwt = require("jsonwebtoken");
const authentication = (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      res.status(403).json({ message: "forbidden" });
    }
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET, (err, result) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: `The token is invalid or expired`,
          err: err,
        });
      } else {
        req.token = result;
        next();
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: "forbidden",
    });
  }
};
module.exports = authentication;
