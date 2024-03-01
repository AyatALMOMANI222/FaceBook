const express = require("express");
const notificationRouter = express.Router();
const {createNotification, getAllNotifications}=require("../controller/notifications")

const authentication=require("../middlewear/authentication")

notificationRouter.post("/",authentication, createNotification)

notificationRouter.get("/", authentication, getAllNotifications)


module.exports = notificationRouter;
