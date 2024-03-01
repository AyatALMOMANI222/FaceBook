import { UserContext } from "../../App";
import React, { use } from "react";
import Chats from "../chats2";
import "./style.css";

const Chats2 = () => {
  const { chates } = use(UserContext);

  return (
    <div className="chates-container">
      {chates.map((item) => {
        return <Chats user_id={item?.id} userName={item?.userName} />;
      })}
    </div>
  );
};

export default Chats2;
