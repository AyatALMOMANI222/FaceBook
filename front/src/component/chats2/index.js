import React, { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "../../App";
import io from "socket.io-client";
import axios from "axios";
import userIcon from "../../icons/userIcon.svg";
import phoneIcon from "../../icons/phoneIcon.svg";
import closeIcon from "../../icons/closeIcon.svg";
import dashIcon from "../../icons/dashIcon.svg";
import SVG from "react-inlinesvg";
import "./style.css";

const Chats = ({ user_id, userName }) => {
  const [openChat, setOpenChat] = useState(false);
  const divRef = useRef(null);
  const socket = io.connect("http://localhost:3001");
  const { chates, setChates, token, userId } = useContext(UserContext);
  const [clickSend, setClickSend] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [allMsg, setAllMsg] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [openMessenger, setOpenMessenger] = useState(true);
  const handleChange = (e) => {
    setMsgText(e.target.value);
  };

  const handleSubmit = () => {
    if (msgText.trim()) {
      axios
        .post(
          `http://localhost:3001/message`,
          { sender_id: userId, receiver_id: user_id, message_text: msgText },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          socket.emit("messageFromFrontend", { message_text: msgText });
          setMsgText("");
        })
        .catch((error) => {});
    }
  };

  const getMsg = () => {
    axios
      .get(`http://localhost:3001/message/${user_id}/${userId}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAllMsg(response.data.messages);
        const messages = response.data.messages || [];
        const sentMessages = messages
          .filter((msg) => msg.sender_id == userId)
          .map((msg) => msg);
        const receivedMessages = messages
          .filter((msg) => msg.sender_id != userId)
          .map((msg) => msg);

        setSentMessages(sentMessages);
        setReceivedMessages(receivedMessages);
      })
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  useEffect(() => {
    socket.on("messageToFrontend", (data) => {
      setAllMsg((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [allMsg]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [openChat, clickSend]);
  const getUserName = () => {
    axios
      .get(`http://localhost:3001/user/${user_id}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {})
      .catch((error) => {
        console.error("Error ", error);
      });
  };

  useEffect(() => {
    getMsg();
    getUserName();
  }, [user_id]);
  return (
    <div className="chates2-container">
      {openChat && (
        <div className="chat2">
          <div className="chat-header">
            <SVG
              className="messages-list-icon"
              src={userIcon}
              height={32}
              width={32}
            />
            <span className="username">{userName}</span>
            <SVG
              className="messages-list-icon"
              src={phoneIcon}
              height={24}
              width={24}
            />
            <SVG
              className="messages-list-icon"
              src={dashIcon}
              height={23}
              width={23}
              onClick={() => setOpenChat(false)}
            />
            <SVG
              className="messages-list-icon"
              src={closeIcon}
              height={28}
              width={28}
              onClick={() => {
                const updatedUsers = chates.filter(
                  (user) => user.id !== user_id
                );
                setChates(updatedUsers);
              }}
            />
          </div>

          <div
            ref={divRef}
            id="messangerContainer"
            className="messanger-content-container"
          >
            {allMsg.map((e) => {
              return <div className="content">{e.message_text}</div>;
            })}
          </div>

          <div className="message-input-container">
            <input
              placeholder="sent Message"
              className="message-input"
              value={msgText}
              onChange={(e) => handleChange(e)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSubmit();
                }
                setTimeout(() => {
                  setClickSend(!clickSend);
                }, ["10"]);
              }}
            />
            <button className="send-message-btn" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      )}
      <div
        className="chat-icon-container"
        onClick={() => {
          setOpenChat(!openChat);
        }}
      >
        <SVG
          className="messages-list-icon"
          src={userIcon}
          height={32}
          width={32}
        />
        <button className="chat-btn">{userName}</button>
      </div>
    </div>
  );
};

export default Chats;
