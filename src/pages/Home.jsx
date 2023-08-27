import { useEffect, useContext, useState, useRef } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";

export default function Home({ setShowBars }) {
  const { data, setData, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);

  const howToLoadData = {
    initial: carouselsLoaded.home || 5,
    load: 4,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    type_: "home",
  };

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={data}
        setData={setData}
        howToLoadData={howToLoadData}
        type_="home"
      />
    </div>
  );
}
