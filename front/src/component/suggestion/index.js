import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css'

const Suggestions = ({ token, userId }) => {
  const [user, setUser] = useState([]);
  const [friend, setFriend] = useState([]);
  const [disabledButtons, setDisabledButtons] = useState([]);

  const getAllUser = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user");
      console.log(response.data.users);
      setUser(response.data.users);
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };

  const getFriendsList = async () => {
    try {
      const response = await axios.get("http://localhost:3001/friend", {
        headers: { authorization: `Bearer ${token}` },
      });
      console.log(response.data.friendsList);
      setFriend(response.data.friendsList);
    } catch (error) {
      console.error("Error getting friends:", error);
    }
  };
  useEffect(() => {
    getAllUser();
    getFriendsList();
  }, []);
  const nonFriends = user.filter((userItem) => {
    return !friend.find(
      (friendItem) => friendItem.user_id === userItem.user_id
    );
  });

  const handleClick = (nonFriend_id) => {
    const friend_id=nonFriend_id
    axios
      .post(
        `http://localhost:3001/friend`,
        { userId,friend_id },
        { headers: { authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data);
        setDisabledButtons([...disabledButtons,friend_id]); // تعطيل الزر بعد إرسال الطلب
        console.log(friend_id,userId);
        
        const updatedFriends = friend.concat({
            user_id: friend_id,
            username: nonFriends.find((user) => user.user_id === friend_id).username,
          });
          setFriend(updatedFriends);
  
          const updatedNonFriends = nonFriends.filter(
            (nonFriend) => nonFriend.user_id !== friend_id
          );
          setUser(updatedNonFriends);
        
      })
      .catch((error) => {
     
        console.error("Error adding friend:", error);
      });
   
  };



  const displayNonFriends = nonFriends.map((nonFriend, index) => (
    <div key={index} className="Addfriend-box">
      <div className="nonfriend_username">{nonFriend.username}</div>
   
      {/* {nonFriend.user_id} */}
      <button className="addfriend-button" onClick={() => handleClick(nonFriend.user_id)} disabled={disabledButtons.includes(nonFriend.user_id)}
>Add Friend</button>
    </div>
  ));
  console.log(nonFriends);

  return <div className="all-page">{displayNonFriends}</div>;
};

export default Suggestions;
