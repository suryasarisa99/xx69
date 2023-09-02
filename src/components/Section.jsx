import { useEffect, useContext, useState, useRef, createRef } from "react";
import Carousel from "./Carousel1";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "./Share";
import { createPortal } from "react-dom";
export default function AiRemover() {
  // let { data } = useLocation().state;
  const { shuffleSection, data, saved } = useContext(DataContext);
  const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const { selected } = useParams();
  let sectionData = [];
  let howToLoadData = {};
  // selected == -1 ? data.flatMap((d) => d.data) : data[selected].data;
  switch (selected) {
    case "gifs": {
      sectionData = data[data.length - 1].data;
      howToLoadData = {
        initial: 3,
        load: 1,
        swipeOnLast: 1,
        total: sectionData.length,
      };

      break;
    }
    case "saved": {
      sectionData = data
        .flatMap((d) => d.data)
        .filter((item) => saved.includes(item.id));
      howToLoadData = {
        initial: 5,
        load: 4,
        swipeOnLast: 3,
        total: sectionData.length,
      };
      break;
    }
    case "-1": {
      sectionData = data.filter((d) => d.type != "gifs").flatMap((d) => d.data);
      howToLoadData = {
        initial: 5,
        load: 4,
        swipeOnLast: 3,
        total: sectionData.length,
      };

      break;
    }
    default:
      sectionData = data[selected]?.data;
      howToLoadData = {
        initial: 5,
        load: 4,
        swipeOnLast: 3,
        total: sectionData.length,
      };
  }
  useEffect(() => {
    async function wait(time) {
      setFinalData([]);
      await new Promise((res, rej) => setTimeout(res, time));
      setFinalData(shuffleSection ? shuffleArray(sectionData) : sectionData);
    }
    wait(0.1);

    document.getElementById("overlay").addEventListener("click", removeOverlay);
    window.addEventListener("scroll", removeOverlay);
    return () => {
      document
        .getElementById("overlay")
        .removeEventListener("click", removeOverlay);
      document
        .getElementById("overlay")
        .removeEventListener("scroll", removeOverlay);
    };
  }, []);

  const openOverlay = () => {
    document.getElementById("overlay").classList.remove("hidden");
  };
  const removeOverlay = () => {
    document.getElementById("overlay").classList.add("hidden");
  };
  const showShare = (obj) => {
    openOverlay();
    setShare(true);
    shareIdRef.current = obj;
  };

  const { loadedCarousels, setLoadedCarousels, handleCarouselSwipe } =
    useCarousel(howToLoadData);

  return (
    <div className="section">
      <form
        action=""
        className="search-bar sbar"
        onSubmit={(e) => {
          e.preventDefault();
          setLoadedCarousels(4);
          navigate(`/search/${selected}/${e.target.query.value}`);
        }}
      >
        <input type="text" placeholder="search" name="query" />
      </form>

      <div className="section-carousels">
        {finalData.slice(0, loadedCarousels).map((item, index) => (
          <div key={index}>
            <Carousel
              key={index}
              type={selected}
              removeCarouselFromSaved={(id) => {
                finalData.splice(id, 1);
                setFinalData([...finalData]);
              }}
              onShare={showShare}
              id={item.id}
              images={item?.images}
              name={item?.title?.replace("-", " ").replace("?", "")}
              onSwipe={() => handleCarouselSwipe(index)}
            />
          </div>
        ))}
      </div>
      {share &&
        createPortal(
          <Share
            onClose={removeOverlay}
            id={shareIdRef.current.id}
            title={shareIdRef.current.name}
          />,
          document.getElementById("overlay")
        )}
      {/* <Share /> */}
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  // setLoadedCarousels(4);
  return array;
}
