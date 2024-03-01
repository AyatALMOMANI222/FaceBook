import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  Fragment,
} from "react";
import axios from "axios";
import userIcon from "../../icons/userIcon.svg";
import phoneIcon from "../../icons/phoneIcon.svg";
import closeIcon from "../../icons/closeIcon.svg";
import dashIcon from "../../icons/dashIcon.svg";
import io from "socket.io-client";
import SVG from "react-inlinesvg";
import { UserContext } from "../../App";
import "./style.css";

const Messenger = ({ user_id, username }) => {
  const divRef = useRef(null);
  const socket = io.connect("http://localhost:3001");
  const { chates, setChates, token, userId } = useContext(UserContext);

  const [msgText, setMsgText] = useState("");
  const [allMsg, setAllMsg] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [openMessenger, setOpenMessenger] = useState(true);

  const handleChange = (e) => {
    setMsgText(e.target.value);
  };

  useEffect(() => {
    console.log(chates);
  }, [chates]);
  const handleSubmit = () => {
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
    // Scroll the div to the bottom when the component mounts

    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [user_id]);
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
    <Fragment>
      <div>
        {openMessenger && (
          <div className="chat-messanger-container">
            <div className="messenger-container">
              <div className="messenger-header-container">
                <div className="messenger-header">
                  <SVG
                    className="messages-list-icon"
                    src={userIcon}
                    height={40}
                    width={40}
                  />
                  <div className="title">
                    <span className="username">
                      {allMsg[0]?.sender_username}
                    </span>
                    <span className="active">Active 6m ago</span>
                  </div>
                </div>

                <div className="icons">
                  <SVG
                    className="messages-list-icon"
                    src={phoneIcon}
                    height={26}
                    width={26}
                  />
                  <SVG
                    className="messages-list-icon"
                    src={dashIcon}
                    height={25}
                    width={25}
                  />
                  <SVG
                    className="messages-list-icon"
                    src={closeIcon}
                    height={34}
                    width={34}
                    onClick={() => setOpenMessenger(false)}
                  />
                </div>
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
                      if (divRef.current) {
                        divRef.current.scrollTop = divRef.current.scrollHeight;
                      }
                    }, ["20"]);
                  }}
                />
                <button className="send-message-btn" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => setOpenMessenger(!openMessenger)}>
        {username}
      </button>
    </Fragment>
  );
};

export default Messenger;
