import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SVG from "react-inlinesvg";
import notificationList from "../../icons/notificationList.svg";
import userIcon from "../../icons/userIcon.svg";
import notificationsIcon from "../../icons/notifications.svg";
import moment from "moment";
import axios from "axios";
import "./style.css";

const Notification = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const getAllNotifications = () => {
    axios
      .get("http://localhost:3001/not", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getAllNotifications();
  }, [openNotification]);

  const handleNotificationClick = (itemId) => {
    navigate(`/post/one/${itemId}`);
  };

  return (
    <div ref={containerRef} className="container-notification-list">
      <SVG
        src={notificationsIcon}
        width={32}
        height={32}
        onClick={() => setOpenNotification(!openNotification)}
      />

      <div className="open-notification">
        {openNotification && (
          <div className="notification-list-container">
            <div className="triangle"></div>
            <div className="notification-list--header">
              <SVG
                className="notification-list-icon"
                src={notificationList}
                height={25}
                width={25}
              />
              <span className="notification">Notifications</span>
            </div>
            <div className="all-notification-container">
              {notifications?.map((item) => {
                return (
                  <div
                    key={item?.notification_id}
                    className="one-notification"
                    onClick={() => handleNotificationClick(item.item_id)}
                  >
                    <div className="notification-list-title">
                      <img
                        className="notification-list-icon"
                        src={item?.profile_picture || userIcon}
                        height={25}
                        width={25}
                      />
                      <span className="username">{item?.username}</span>
                    </div>
                    <div className="date">
                      {moment(item?.created_at).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </div>
                    <div className="message">{item?.message}</div>
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

export default Notification;
