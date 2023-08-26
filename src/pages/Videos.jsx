import { useEffect, useContext, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
import Suggest from "../components/Suggest";

export default function Videos({ setShowBars }) {
  const { gifs, setGifs, carouselsLoaded, dispatchLoaded, getAxios, profile } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(gifs);
  }, []);
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
