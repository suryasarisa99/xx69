import React from "react";
import "./loadingcard.scss";
export default function LoadingImg({ name }) {
  return (
    <div className="loading-card">
      <div className="glossy-effect">
        <p className="large-text">Loading ... X</p>
        <p className="small-text">{name}</p>
      </div>
    </div>
  );
}
