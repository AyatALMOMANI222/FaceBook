import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import chatIcon from "../../icons/chatIcon.svg";
import userIcon from "../../icons/userIcon.svg";
import messengerIcon from "../../icons/messenger.svg";
import { UserContext } from "../../App";
import moment from "moment";
import axios from "axios";
import "./style.css";

const MessagesList = ({ token }) => {
  const { chates, setChates } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [openUsersList, setOpenUsersList] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenUsersList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getUsers();
  }, [openUsersList]);

  return (
    <div ref={containerRef} className="container-messages-list">
      <SVG
        src={messengerIcon}
        width={32}
        height={32}
        onClick={() => setOpenUsersList(!openUsersList)}
      />

      <div className="open-messages">
        {openUsersList && (
          <div className="messages-list-container">
            <div className="triangle"></div>
            <div className="messages-list--header">
              <SVG
                className="messages-list-icon"
                src={chatIcon}
                height={25}
                width={25}
              />
              <span className="messages">Messages</span>
            </div>
            <div className="all-messages-container">
              {users?.map((item) => {
                return (
                  <div
                    key={item?.messages_id}
                    className="one-messages"
                    onClick={() => {
                      setChates((prev) => {
                        return [
                          ...prev,
                          { id: item?.user_id, userName: item?.username },
                        ];
                      });
                      // navigate(`/messenger/${item?.user_id}`);
                    }}
                  >
                    <div className="messages-list-title">
                      <img
                        className="messages-list-icon"
                        src={item?.profile_picture || userIcon}
                        height={30}
                        width={30}
                      />
                      <span className="username">{item?.username}</span>
                    </div>

                    <div className="message">Contact With Me</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
