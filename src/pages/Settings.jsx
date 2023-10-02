import { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import Switch from "../components/Switch";
import { GrLinkNext } from "react-icons/gr";

export default function Settings() {
  const { toggles } = useContext(DataContext);
  const navigate = useNavigate();
  return (
    <div className="settings">
      <h1>Settings</h1>

      <Group title="Carousel">
        <Toggle
          state="slide"
          disabledWith={toggles.isCarousel2 ? true : undefined}
        >
          Slide Animation
        </Toggle>
        <Toggle
          state="lastImg"
          disabledWith={toggles.isCarousel2 ? false : undefined}
        >
          Set to Last Image
        </Toggle>
        <Toggle state="reverseOrder">Reverse Images</Toggle>
        <Toggle state="isCarousel2">Use Carousel2</Toggle>
      </Group>

      <Group title="Shuffle">
        <Toggle state="shuffleSearchResults">Shuffle Search Results</Toggle>
        <Toggle state="shuffleSaved">Shuffle Saved Items</Toggle>
      </Group>

      <Group title="Other">
        <Toggle state="persistantScroll"> Persistant scroll</Toggle>
        <Toggle state="fuzzySearch"> Fuzzy Search</Toggle>
        <Toggle state="devMode">Dev Mode</Toggle>
        <Toggle state="blur">Blur Images</Toggle>
      </Group>

      <div className="section">
        <div className="link">
          Go To Previous Version Of X69
          <i
            className="icon-outer"
            onClick={() => open("https://6x9.vercel.app")}
          >
            <GrLinkNext className="icon" />
          </i>
        </div>
      </div>
    </div>
  );
}

function Group({ children, title }) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ children, state, ...rest }) {
  return (
    <div className="toggle">
      <p>{children}</p>
      <Switch state={state} {...rest} />
    </div>
  );
}
