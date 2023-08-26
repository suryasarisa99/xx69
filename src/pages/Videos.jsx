import { useEffect, useContext, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
import Suggest from "../components/Suggest";

export default function Videos({ setShowBars }) {
  const { gifs, setGifs, carouselsLoaded, dispatchLoaded, getAxios } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(gifs);
    if (gifs.length == 0) {
      getAxios("data/gifs", { id: "surya" }).then((res) => setGifs(res.data));
    }
  }, []);
  const howToLoadData = {
    initial: 2,
    load: 1,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 2,
    type_: "videos",
    total: 20,
  };

  useEffect(() => {
    // async function wait(time) {
    // setFinalData([]);
    // await new Promise((res, rej) => setTimeout(res, time));
    // setFinalData(data);
    // setFinalData(shuffleSection ? shuffleArray([...savedData]) : savedData);
    // }
    // wait(2000);
  }, []);

  return (
    <div>
      {/* {data.length > 0 && ( */}
      <Section
        setShowBars={setShowBars}
        data={gifs}
        setData={setFinalData}
        howToLoadData={howToLoadData}
        type_="videos"
      />
      {/* )} */}
    </div>
  );
}
