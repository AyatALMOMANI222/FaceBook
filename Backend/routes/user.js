const express = require("express");
const {
  createUser,
  updateUser,
  getAllUsers,
  deleteUserById,
  getUserById,
  getAllUsersExceptCurrent,
} = require("../controller/user");
const authentication = require("../middlewear/authentication");
const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/", createUser);
userRouter.put("/updateUser",authentication, updateUser);
userRouter.get("/", getAllUsers);
userRouter.get("/:user_id", getUserById);
userRouter.get("/all/:user_id",authentication, getAllUsersExceptCurrent);

userRouter.delete("/:user_id", deleteUserById);
module.exports = userRouter;
