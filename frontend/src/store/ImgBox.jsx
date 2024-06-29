import React from "react";
import "./../App.css";

const ImgBox = (props) => (
  <div className={`height-${props.value} ${props.className}`}>
    <img
      src={props.src}
      alt="background"
      style={{ width: "100%", height: "100%" }}
    />
  </div>
);

export default ImgBox;
