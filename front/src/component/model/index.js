import React, { Fragment } from "react";

import "./style.css";
const Modal = ({ isModalOpen, setIsModalOpen, children }) => {
  return (
    <Fragment>
      {isModalOpen && (
        <div className="dialog-containerr">
          <div>
            <div className="overlayr"></div>
            <div className="contant-container">
              <div className="contant">
                  {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default Modal;
