import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaChevronLeft } from "react-icons/fa";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";
import Share from "../components/Share";
import { createPortal } from "react-dom";
import useCarousel from "../../hooks/useCarousel";
import Section from "./Section";
import SearchResults from "../components/SearchResults";
import Fuse from "fuse.js";
import axios from "axios";

export default function Search() {
  const navigate = useNavigate();
  const { query: q, selected } = useParams();
  const [query, setQuery] = useState(q);
  const [finalQuery, setFinalQuery] = useState(q);
  const [showBars, setShowBars] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const prevScrollPos = useRef(null);
  const { shuffleSearchResults, data, saved, carouselsLoaded, dispatchLoaded } =
    useContext(DataContext);

  let [filteredData, setFilterData] = useState([]);
  // shuffleSearchResults ? data[selected].data : data[selected].data;
  // shuffleSearchResults ? shuffleArray(data) : data
  // const { handleCarouselSwipe, setTotal } = useCarousel();
  const howToLoadData = {
    total: filteredData.length,
    type_: "search",
    load: selected == "videos" ? 2 : 4,
    dispatchLoaded,
    carouselsLoaded,
  };

  // selected == -1 ? data.flatMap((d) => d.data) : data[selected].data;

  function selectResult(item) {
    setFinalQuery(item);
    setQuery(item);
    setShowResults(false);
  }
  let fuse = useRef(null);

  useEffect(() => {
    if (selected == "videos") dispatchLoaded({ type: "videos", payload: 2 });
  }, [selected]);
  useEffect(() => {
    let searchData = [];

    switch (selected) {
      case "gifs": {
        searchData = data.filter((d) => d.images?.[0].endsWith(".gif"));
        console.log("Gifs");
        console.log(searchData);
        break;
      }
      case "saved": {
        searchData = data.filter((d) => saved.includes(d._id));
        break;
      }
      default:
        searchData = data;
    }
    console.log(searchData);
    fuse.current = new Fuse(searchData, {
      keys: ["name", "title"],
      includeScore: true,
      threshold: 0.4,
    });
  }, [data]);

  useEffect(() => {
    dispatchLoaded({ type: "search", payload: 4 });

    async function wait(time) {
      setFilterData([]);
      await new Promise((resolve, reject) => {
        setTimeout(resolve, time);
      });

      // let fdata = searchData.filter((item) =>
      //   item?.title?.toLowerCase()?.includes(query.toLowerCase())
      // );

      // let fdata = fuse.current.search(query).map((item) => item.item);
      // setFilterData(shuffleSearchResults ? shuffleArray(fdata) : fdata);

      axios
        .get(`${import.meta.env.VITE_SERVER}/data/search/${finalQuery}`)
        .then((res) => setFilterData(res.data));
      // console.log(fdata);
    }
    if (query != "") wait(0.1);
  }, [finalQuery]);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    console.log(`${prevScrollPos.current}  ${currentScrollPos}`);
    setShowBars(currentScrollPos < prevScrollPos.current);
    prevScrollPos.current = currentScrollPos;
  };

  return (
    <div className="search">
      {showBars && (
        <form
          action=""
          className={"search-bar mini-search-bar "}
          onSubmit={(e) => {
            e.preventDefault();
            setFinalQuery(query);
            setShowResults(false);
            // navigate(`/search/${selected}/${query}`);
            // if (query != e.target.query.value) setQuery(e.target.query.value);
            dispatchLoaded({ type: "saved", payload: 4 });
          }}
        >
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft class="btn" />
          </button>
          <input
            type="text"
            name="query"
            className="search-bar-input"
            value={query}
            onChange={(e) => {
              setShowResults(true);
              setQuery(e.target.value);
            }}
          />
        </form>
      )}
      {showResults && <SearchResults name={query} onSelect={selectResult} />}

      <Section
        data={filteredData}
        howToLoadData={howToLoadData}
        type_="search"
        setMiniSearchBar={setShowBars}
      />
    </div>
  );
}

function shuffleArray() {}
