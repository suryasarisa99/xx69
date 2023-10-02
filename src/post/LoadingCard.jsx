import React from "react";
import "./loadingcard.scss";
export default function LoadingCard({ onSwipe, index, ...rest }) {
  return (
    <div
      className="carousel card"
      onTouchStart={onSwipe}
      onMouseOverCapture={onSwipe}
      {...rest}
    >
      <div className="loading-card">
        <div className="glossy-effect">
          <p className="large-text">Loading ...X</p>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="name"></div>
        <div className="icons"></div>
      </div>
    </div>
  );
}
