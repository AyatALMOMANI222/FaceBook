import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import SVG from "react-inlinesvg";
import PointIcon from "../../icons/point.svg";

const Carousel = ({ items, title, move, setMove, titleDataId }) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [isMousePressed, setMousePressed] = useState(false);
  const [initialX, setInitialX] = useState(null);
  const itemRef = useRef(null);
  const handleMouseDown = (e) => {
    setMousePressed(true);
    setInitialX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isMousePressed) {
      const currentX = e.clientX;
      if (currentX > initialX && currentItem !== 0) {
        setCurrentItem(currentItem - 1);
      } else if (currentX < initialX && currentItem < items?.length - 1) {
        setCurrentItem(currentItem + 1);
      }
    }
  };

  const handleMouseUp = () => {
    setMousePressed(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMousePressed]);

  useEffect(() => {
    setMove && setMove(!move);
  }, [currentItem]);

  return (
    <div className="carousel-container">
      <div className="carousel-title" data-id={titleDataId}>
        {title}
      </div>
      <div className="carousel">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(${dir == "ltr" ? "-" : ""}${
              currentItem * itemRef?.current?.offsetWidth + currentItem * 12
            }px)`,
          }}
          onMouseDown={handleMouseDown}
        >
          {items?.map((item, index) => (
            <div ref={itemRef} key={index} className="carousel-element">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="points-container">
        {items?.map((item, index) => {
          return (
            <SVG
              src={PointIcon}
              className={`point ${currentItem === index && "active"}`}
              width={12}
              height={12}
              onClick={() => setCurrentItem(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
