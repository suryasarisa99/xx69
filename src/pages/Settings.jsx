import { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import Switch from "../components/Switch";
import { GrLinkNext } from "react-icons/gr";
import Suggest from "../components/Suggest";

export default function Settings() {
  const {
    slide,
    setSlide,
    lastImg,
    setLastImg,
    reverseOrder,
    setReverseOrder,
    shuffleSearchResults,
    shuffleSection,
    setShuffleSearchResults,
    setShuffleSection,
    shuffleSaved,
    setShuffleSaved,
    toggles,
    persistantScroll,
    setPersistantScroll,
    isCarousel2,
    setIsCarousel2,
    fromDb,
    setFromDb,
  } = useContext(DataContext);
  const navigate = useNavigate();
  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="section">
        <h3>Carousel</h3>
        <div className="toggle">
          <p>Slide Animation</p>
          <Switch
            state={slide}
            stateFun={setSlide}
            saveAs="slide"
            disabledWith={isCarousel2 ? true : undefined}
          />
        </div>
        <div className="toggle">
          <p>Set to Last Image</p>
          <Switch
            state={lastImg}
            stateFun={setLastImg}
            saveAs="lastImg"
            disabledWith={isCarousel2 ? false : undefined}
          />
        </div>
        <div className="toggle">
          <p>Reverse Images</p>
          <Switch
            state={reverseOrder}
            stateFun={setReverseOrder}
            saveAs="reverse"
          />
        </div>
        <div className="toggle">
          <p>Use Carousel2</p>
          <Switch
            state={isCarousel2}
            stateFun={setIsCarousel2}
            saveAs="carousel2"
          />
        </div>
      </div>
      <div className="section">
        <h3>Shuffle</h3>
        <div className="toggle">
          <p>Shuffle Home Results</p>
          <Switch
            state={shuffleSection}
            stateFun={setShuffleSection}
            saveAs="shuffleSection"
          />
        </div>
        <div className="toggle">
          <p>Shuffle Search Results</p>
          <Switch
            state={shuffleSearchResults}
            stateFun={setShuffleSearchResults}
            saveAs="shuffleResults"
          />
        </div>
        <div className="toggle">
          <p>Shuffle Saved Items</p>
          <Switch
            state={shuffleSaved}
            stateFun={setShuffleSaved}
            saveAs="shuffleSaved"
          />
        </div>
      </div>

      <div className="section">
        <h3>Persistant</h3>
        <div className="toggle">
          <p>Persistant scroll</p>
          <Switch
            state={persistantScroll}
            stateFun={setPersistantScroll}
            saveAs="persistantScroll"
          />
        </div>
        <div className="toggle">
          <p>From Db</p>
          <Switch state={fromDb} stateFun={setFromDb} saveAs="fromDb" />
        </div>
      </div>

      <div className="section">
        <div className="link">
          Go To Previous Version Of X69{" "}
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
