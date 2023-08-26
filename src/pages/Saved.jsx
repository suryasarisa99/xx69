import { useEffect, useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
export default function Saved({ setShowBars }) {
  const {
    shuffleSaved,
    data,
    saved,
    carouselsLoaded,
    dispatchLoaded,
    setSaved,
  } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);

  const howToLoadData = {
    load: 4,
    type_: "saved",
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
  };

  useEffect(() => {
    // const x = saved.map((s) => {
    //   if (s?.id) return data.find((d) => (d._id = s.id));
    //   else return s;
    // });
    // setSaved([...x]);
    setFinalData(saved);
  }, []);

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={finalData}
        howToLoadData={howToLoadData}
        type_="saved"
      />
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
