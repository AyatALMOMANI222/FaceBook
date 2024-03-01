const express = require("express");
const {createPost,getAllPosts,deletePostbyId,updatePost,getPostsByUserId,createPostByUserId , getPostById}=require("../controller/post")
const authentication=require("../middlewear/authentication")
 const postRouter = express.Router();
postRouter.post("/",authentication, createPost)
postRouter.post("/:user_id",authentication,createPostByUserId)

postRouter.get("/:user_id",authentication,getPostsByUserId)
postRouter.get("/",getAllPosts)

postRouter.delete("/:id",deletePostbyId)
postRouter.put("/:id",authentication, updatePost)
postRouter.get("/one/:id",getPostById)
module.exports = postRouter;
