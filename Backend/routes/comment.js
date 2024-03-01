const express = require("express");
const {
  createComment,
  getCommentsByPostId,
  deleteCommentById,
  getComments,
} = require("../controller/comment");
const commentRouter = express.Router();
const authentication = require("../middlewear/authentication");
commentRouter.post("/", createComment);
commentRouter.get("/:post_id", getCommentsByPostId);
commentRouter.get("/", getComments);
commentRouter.delete("/:comment_id", authentication, deleteCommentById);
commentRouter.delete("/:user_id", authentication, deleteCommentById);
module.exports = commentRouter;
