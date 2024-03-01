import React, { createContext, Fragment, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Register,
  Login,
  PublicPage,
  Profile,
  Navbar,
  Friend,
  Setting,
  Message,
  Mode,
  Notification,
  User,
  AllFriends,
  FriendRequests,
  Suggestions,
  Search,
  SearchView,
  Messenger,
  OnePost,
  FriendProfile,
  MessagesList,
  Chats,
} from "./component";
import "./App.css";
import { Toast } from "./component/Toast";
import ProfileFriend from "./component/profileFriend";
export const UserContext = createContext();

function Main() {
  const navigate = useNavigate();

  // الحصول على التوكن و userId من localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profile_picture = localStorage.getItem("profile_picture");
  // استخدام التوكن و userId بدون props
  console.log(token, userId);

  return (
    <Fragment>
      <Navbar token={token} userId={userId} />

      <div className={`facebook-container`}>
        <div className="main-container">
          <Routes>
            <Route
              path="/register"
              element={<Register token={token} userId={userId} />}
            ></Route>
            <Route
              path="/"
              element={<Login token={token} userId={userId} />}
            ></Route>
            <Route
              path="/friend"
              element={<Friend token={token} userId={userId} />}
            ></Route>
            <Route
              path="/profile"
              element={<Profile token={token} userId={userId} />}
            ></Route>
            <Route
              path="/publicPage"
              element={<PublicPage token={token} userId={userId} />}
            ></Route>
            <Route
              path="/navbar"
              element={<Navbar token={token} userId={userId} />}
            ></Route>
            <Route
              path="/user"
              element={<User token={token} userId={userId} />}
            ></Route>
            <Route
              path="/FriendRequests"
              element={<FriendRequests token={token} userId={userId} />}
            ></Route>
            <Route
              path="/Suggestions"
              element={<Suggestions token={token} userId={userId} />}
            ></Route>
            <Route
              path="/AllFriends"
              element={<AllFriends token={token} userId={userId} />}
            ></Route>
            <Route
              path="/AllFriends/:userId"
              element={<ProfileFriend token={token} />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/search-view/:term" element={<SearchView />} />
            <Route
              path="/post/one/:itemId"
              element={<OnePost token={token} userId={userId} />}
            />
            <Route
              path="/friendProfile/:userId"
              element={<FriendProfile token={token} />}
            />
          </Routes>
        </div>

        <div className="chat-dev-container">
          <Chats />
        </div>
      </div>
    </Fragment>
  );
}

const App = () => {
  const [chates, setChates] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [openToast, setOpenToast] = useState(false);
  const [toaseMessage, setToastMessage] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    const handleOpenToast = (detail) => {
      console.log(detail);
      setToastMessage(detail?.detail?.message);
      setMode(detail?.detail?.mode);
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 3500);
    };

    window.addEventListener("OPEN_TOAST", handleOpenToast);

    return () => {
      window.removeEventListener("OPEN_TOAST", handleOpenToast);
    };
  }, [openToast]);

  return (
    <div>
      <UserContext.Provider
        value={{
          chates,
          setChates,
          token,
          userId,
        }}
      >
        <Toast open={openToast} message={toaseMessage} mode={mode} />
        <Main />
      </UserContext.Provider>
    </div>
  );
};
export default App;
