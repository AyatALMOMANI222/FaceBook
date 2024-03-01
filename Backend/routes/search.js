const express = require("express");
const searchRouter = express.Router();
const {search}=require("../controller/search")

searchRouter.get("/:searchTerm",search)

module.exports = searchRouter;
