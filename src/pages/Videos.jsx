import { useEffect, useContext, useState, useRef } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";

export default function Videos({ setShowBars }) {
  const { gifs, setGifs, carouselsLoaded, dispatchLoaded, getAxios, profile } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    if (gifs.length == 0 && profile) {
      getAxios("data/gifs", { id: profile._id }).then((res) =>
        setGifs(res.data)
      );
    }
  }, [profile]);

  const howToLoadData = {
    initial: 2,
    load: 1,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 2,
    type_: "videos",
    total: 20,
  };

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={gifs}
        setData={setGifs}
        howToLoadData={howToLoadData}
        type_="videos"
      />
    </div>
  );
}
