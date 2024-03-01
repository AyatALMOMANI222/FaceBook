const express = require("express");
 const login=require("../controller/login")

 const loginRouter = express.Router();
loginRouter.post("/",login)



module.exports = loginRouter;
