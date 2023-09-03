import { useEffect, useContext, useState, useRef } from "react";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import useCarousel from "../../hooks/useCarousel";
import Share from "../components/Share";
import { createPortal } from "react-dom";
import Suggest from "../components/Suggest";
import Post from "../components/Post";
import axios from "axios";
import LoadingCard from "../components/LoadingCard";
import _throttle from "lodash/throttle";
export default function Section({
  data,
  setData,
  howToLoadData,
  type_,
  setMiniSearchBar,
}) {
  howToLoadData.total = data.length;
  const { handleCarouselSwipe, setTotal } = useCarousel(howToLoadData);
  const {
    scrollPos,
    carouselsLoaded,
    setShowBars,
    getAxios,
    toggles,
    profile,
  } = useContext(DataContext);
  // const [finalData, setFinalData] = useState([]);
  const [share, setShare] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [suggName, setSuggName] = useState("");
  const [id, setId] = useState(-1);
  const shareIdRef = useRef(null);
  const navigate = useNavigate();
  const prevScrollPos = useRef(null);
  const sectionRef = useRef(null);
  const cleanupRef = useRef(null);

  const showShare = (obj) => {
    openOverlay();
    setShare(true);
    shareIdRef.current = obj;
  };
  const openOverlay = () => {
    document.getElementById("overlay").classList.remove("hidden");
  };
  const removeOverlay = (e) => {
    console.log(e);
    if (
      !document.querySelector(".suggestions")?.contains(e.target) &&
      !document.querySelector(".share")?.contains(e.target)
    ) {
      setShare(false);
      setSuggestions(false);
      document.getElementById("overlay").classList.add("hidden");
    }
  };
  const foreCloseOverlay = (e) => {
    document.getElementById("overlay").classList.add("hidden");
  };
  const handleScroll = _throttle(() => {
    const currentScrollPos = sectionRef.current.scrollTop;
    // console.log(
    //   `current: ${currentScrollPos}  prv: ${prevScrollPos.current} final: ${
    //     currentScrollPos - prevScrollPos.current
    //   }`
    // );
    if (currentScrollPos - prevScrollPos.current > 40) {
      // scroll down
      setShowBars(false);
    }
    if (currentScrollPos - prevScrollPos.current < -80) {
      // for scroll up
      setShowBars(true);
      // setMiniSearchBar?.(currentScrollPos < prevScrollPos.current);
    }
    prevScrollPos.current = currentScrollPos;
  }, 80);

  function showSuggestions({ title, id }) {
    openOverlay();
    setSuggestions(true);
    setSuggName(title);
    setId(id);
  }

  function selectSuggestion(name) {
    setSuggestions(false);
    foreCloseOverlay();
    let index = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id == id) {
        index = i;
        break;
      }
    }
    axios
      .post(`${import.meta.env.VITE_SERVER}/data/update-name`, {
        name,
        id,
      })
      .then((res) => console.log(res));

    data[index].name = name;
    setData([...data]);
  }

  useEffect(() => {
    setTotal(data.length);
  }, [data]);

  // For Persistant Scroll
  useEffect(() => {
    const sectionCopy = sectionRef.current;
    setShowBars(true);
    setMiniSearchBar?.(true);
    async function wait() {
      if (sectionCopy) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            sectionRef.current.scrollTo({
              top: scrollPos[type_],
              behavior: "instant",
            });
            res();
          }, 20);
        });
        setTimeout(() => {
          setShowBars(true);
        }, 20);
      }
    }
    if (toggles.persistantScroll) wait();

    sectionCopy.addEventListener("scroll", handleScroll);
    cleanupRef.current = () => {
      sectionCopy.removeEventListener("scroll", handleScroll);
    };
    return () => {
      cleanupRef.current();
    };
  }, [toggles.persistantScroll, scrollPos, type_]);

  //* event lis for overlay and window scroll
  useEffect(() => {
    document.getElementById("overlay").addEventListener("click", removeOverlay);
    // document
    //   .querySelector(".section .section-carousels")
    //   .addEventListener("scroll", removeOverlay);
    return () => {
      // dispatch({ type_, payload: SectionCopy.scrollTop });
      document
        .getElementById("overlay")
        .removeEventListener("click", removeOverlay);
      document
        .getElementById("overlay")
        .removeEventListener("scroll", removeOverlay);
    };
  }, []);

  function addLike(id) {
    setData((prv) =>
      prv.map((item) => {
        if (id == item._id) {
          item.likes += 1;
          item.likeStatus = true;
          return item;
        } else return item;
      })
    );
  }

  function removeLike(id) {
    setData((prv) =>
      prv.map((item) => {
        if (id == item._id) {
          item.likeStatus = false;
          item.likes -= 1;
          return item;
        } else return item;
      })
    );
  }
  console.log(data);
  return (
    <div className="x section">
      {/* {toggles.devMode && (
        <p className="temp">loaded carousels: {carouselsLoaded[type_]}</p>
      )} */}
      <div className="section-carousels" ref={sectionRef}>
        {data?.slice(0, carouselsLoaded[type_]).map((item, index) => (
          <Post
            key={index}
            type_={type_}
            onShare={showShare}
            showSuggestions={showSuggestions}
            id={item._id}
            addLike={addLike}
            removeLike={removeLike}
            item={item}
            cIndex={index}
            onSwipe={() => {
              handleCarouselSwipe(index);

              if (type_ != "home" || data.length - 1 - index > 8) return;

              getAxios(`data`, { id: profile._id }).then((res) => {
                console.log(res.data);
                setData((prvData) => [...prvData, ...res.data]);
              });
            }}
          />
        ))}
        {data.length == 0 && (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        )}
        {/* <LoadingCard
          onSwipe={() => {
            handleCarouselSwipe(9999);
            // if (type_ != "home" || data.length - 1 - index > 8) return;
            // axios.get(`${import.meta.env.VITE_SERVER}/data`).then((res) => {
            //   console.log(res.data);
            //   setData((prvData) => [...prvData, ...res.data.data]);
            // });
          }}
        /> */}
      </div>
      {share &&
        createPortal(
          <Share
            forceClose={foreCloseOverlay}
            id={shareIdRef.current.id}
            title={shareIdRef.current.name}
          />,
          document.getElementById("overlay")
        )}
      {suggestions &&
        createPortal(
          <Suggest name={suggName} onSelect={selectSuggestion} />,
          document.getElementById("overlay")
        )}
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
