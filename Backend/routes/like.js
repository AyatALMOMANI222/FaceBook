const express = require("express");
const {addLike,deleteLikebyId}=require("../controller/like");

const authentication=require("../middlewear/authentication")
 const likeRouter = express.Router();
likeRouter.post("/",authentication, addLike)
likeRouter.delete("/:post_id", authentication, deleteLikebyId)


module.exports = likeRouter;
