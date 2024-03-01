const express = require("express");
const messageRouter = express.Router();

  const {createMessage,  getMessagesBetweenTwoPerson,deleteConverBetTwoPerson ,deleteAllConversationsWithUser , getAllConversations, getReceivedMessages, updateMessage, deleteMessageBySenderId}=require("../controller/messeges")
const authentication =require("../middlewear/authentication")
messageRouter.post("/",authentication ,createMessage)
messageRouter.get("/:other_user_id/:user_id",authentication,getMessagesBetweenTwoPerson)
messageRouter.delete("/",authentication, deleteConverBetTwoPerson)
messageRouter.delete("/all",authentication,deleteAllConversationsWithUser)
messageRouter.get("/all",authentication,getAllConversations)
messageRouter.get("/mymsg",authentication,getReceivedMessages)
messageRouter.post("/newmsg", authentication,updateMessage)
messageRouter.delete("/deletemsg", authentication, deleteMessageBySenderId)
module.exports = messageRouter;
