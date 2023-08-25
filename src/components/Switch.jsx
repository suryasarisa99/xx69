import React, { useState, useContext } from "react";
import "./switch.css"; // You can create a separate CSS file for styling
import { DataContext } from "../context/DataContext";
const Switch = ({ state, stateFun, saveAs, disabledWith }) => {
  //   const [state, stateFun] = useState(checked || false);
  // console.log("toggle set");
  let { toggles } = useContext(DataContext);
  const handleToggle = () => {
    if (disabledWith == undefined) {
      toggles[saveAs] = !state;
      localStorage.setItem("toggles", JSON.stringify(toggles));
      stateFun(!state);
    }
  };

  return (
    <label
      className={"switch " + (disabledWith != undefined ? "disabled" : "")}
    >
      <input
        type="checkbox"
        checked={disabledWith == undefined ? state : disabledWith}
        disabled={disabledWith == undefined ? false : true}
        onChange={handleToggle}
      />
      <span className="track">
        <span className="thumb"></span>
      </span>
    </label>
  );
};

export default Switch;
