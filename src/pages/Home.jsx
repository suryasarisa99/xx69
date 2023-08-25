import { useEffect, useContext, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import Section from "./Section";
import Suggest from "../components/Suggest";

export default function Home({ setShowBars }) {
  const { data, setData, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const navigate = useNavigate();
  let savedData = data;

  const howToLoadData = {
    initial: carouselsLoaded.home || 5,
    load: 4,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 3,
    type_: "home",
    total: savedData.length,
  };

  return (
    <div>
      {/* {data.length > 0 && ( */}
      <Section
        setShowBars={setShowBars}
        data={data}
        setData={setData}
        howToLoadData={howToLoadData}
        type_="home"
      />
      {/* )} */}
    </div>
  );
}
