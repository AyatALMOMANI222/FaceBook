const express = require('express');
const {addFriend,acceptFriendRequest,rejectFriendRequest,getFriendsList,getFriendRequests,removeFriend, getFriendsListById} = require('../controller/friend');
const friendRouter = express.Router();
const authentication=require("../middlewear/authentication")
// الآن هنا تحدث المشكلة، فإن كتابة post يجب أن يتم تحديدها باستخدام دالة المعالج الصحيحة
friendRouter.post('/',authentication, addFriend);
friendRouter.put('/accept/:friendship_id',authentication, acceptFriendRequest)
friendRouter.put('/reject/:friendship_id',authentication, rejectFriendRequest)
friendRouter.get('/',authentication, getFriendsList)
friendRouter.get('/:user_id',authentication, getFriendsListById)
friendRouter.get('/request',authentication, getFriendRequests)
friendRouter.delete('/:friendship_id',authentication, removeFriend)

module.exports = friendRouter;
