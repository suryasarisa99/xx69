import { useEffect, useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
export default function Saved({ setShowBars }) {
  const {
    saved,
    carouselsLoaded,
    dispatchLoaded,
    setSaved,
    getAxios,
    profile,
    fetching,
    setSavedIds,
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
    if (saved.length == 0 && profile && fetching.current.saved == 0) {
      fetching.current.saved = 1;
      console.log("fetching saved - from saved");
      getAxios("data/saved", { id: profile._id }).then((res) => {
        fetching.current.saved = 2;
        console.log(res.data);
        setSaved(res.data);
        setFinalData(res.data);
        setSavedIds(res.data.map((s) => s._id));
      });
    }
  }, [profile, fetching]);

  useEffect(() => {
    setFinalData(saved);
  }, [profile]);

  return (
    <div>
      <Section
        setShowBars={setShowBars}
        data={finalData}
        setData={setFinalData}
        howToLoadData={howToLoadData}
        type_="saved"
      />
    </div>
  );
}
