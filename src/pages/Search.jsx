import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { FaChevronLeft } from "react-icons/fa";
import Section from "./Section";
import SearchResults from "../components/SearchResults";
import Fuse from "fuse.js";
import axios from "axios";
import data from "../../data.json";

export default function Search({ type_ }) {
  const navigate = useNavigate();
  const { query: q, selected } = useParams();
  const [query, setQuery] = useState(q);
  const [finalQuery, setFinalQuery] = useState(q);
  const [showBars, setShowBars] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const prevScrollPos = useRef(null);
  const {
    currentUser,
    saved,
    carouselsLoaded,
    dispatchLoaded,
    getAxios,
    toggles,
  } = useContext(DataContext);

  let [filteredData, setFilterData] = useState([]);

  const howToLoadData = {
    total: filteredData.length,
    type_: "search",
    load: selected == "videos" ? 2 : 4,
    dispatchLoaded,
    carouselsLoaded,
  };

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
      threshold: 0.3,
    });
  }, [data]);

  useEffect(() => {
    dispatchLoaded({ type: "search", payload: 4 });
    if (currentUser == null) return;
    if (toggles.fuzzySearch) {
      let home = ["/x/home" || "/x" || "/"];
      if (selected == "home") {
        let fdata = fuse.current.search(query).map((item) => item.item._id);
        if (toggles.devMode) {
          getAxios("data/dev-search", {
            ids: fdata,
            accId: currentUser.uid,
          }).then((res) => setFilterData(res.data));
        } else {
          getAxios("data/f-search", {
            ids: fdata,
            accId: currentUser.uid,
          }).then((res) => setFilterData(res.data));
        }
      } else if (selected == "saved") {
        let savedFuse = new Fuse(saved, {
          keys: ["name", "title"],
          includeScore: true,
          threshold: 0.4,
        });
        let fdata = savedFuse.search(query).map((item) => item.item);
        console.log(fdata);
        setFilterData(fdata);
      }

      // setFilterData(shuffleSearchResults ? shuffleArray(fdata) : fdata);
    } else if (query != "" && currentUser) {
      setFilterData([]);
      if (selected == "home") {
        axios
          .post(`${import.meta.env.VITE_SERVER}/data/search/${finalQuery}`, {
            id: currentUser.uid,
          })
          .then((res) => setFilterData(res.data));
      }
    }
  }, [finalQuery, currentUser]);

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
        setData={setFilterData}
        howToLoadData={howToLoadData}
        type_="search"
        setMiniSearchBar={setShowBars}
      />
    </div>
  );
}

function shuffleArray() {}
