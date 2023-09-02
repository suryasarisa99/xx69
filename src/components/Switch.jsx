import React, { useState, useContext } from "react";
import "./switch.css"; // You can create a separate CSS file for styling
import { DataContext } from "../context/DataContext";
const Switch = ({ state, disabledWith }) => {
  //   const [state, stateFun] = useState(checked || false);
  // console.log("toggle set");
  let { toggles, tg, dispatchToggles } = useContext(DataContext);
  const handleToggle = () => {
    if (disabledWith == undefined) {
      tg[state] = !toggles[state];
      localStorage.setItem("toggles", JSON.stringify(tg));
      // stateFun(!state);
      dispatchToggles({ type: state, payload: !toggles[state] });
    }
  };

  return (
    <label
      className={"switch " + (disabledWith != undefined ? "disabled" : "")}
    >
      <input
        type="checkbox"
        checked={disabledWith == undefined ? toggles[state] : disabledWith}
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
