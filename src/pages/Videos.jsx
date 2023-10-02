import { useEffect, useContext, useState, useRef } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";

export default function Videos({ setShowBars }) {
  const {
    gifs,
    setGifs,
    carouselsLoaded,
    dispatchLoaded,
    getAxios,
    currentUser,
  } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    if (gifs.length == 0 && currentUser) {
      getAxios("data/gifs", { id: currentUser.uid }).then((res) =>
        setGifs(res.data)
      );
    }
  }, [currentUser]);

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
    <div className="videos">
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
