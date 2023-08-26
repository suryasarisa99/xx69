import React from "react";
import "./loadingcard.scss";
export default function LoadingCard() {
  return (
    <div className="carousel card">
      <div className="loading-card">
        <div className="glossy-effect">
          <p>Loading ...</p>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="name"></div>
        <div className="icons"></div>
      </div>
    </div>
  );
}
