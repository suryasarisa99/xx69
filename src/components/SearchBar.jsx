import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import SearchResults from "./SearchResults";
import { motion } from "framer-motion";
export default function SearchBar({ type_ }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const [query, setQuery] = useState("");
  const {
    scrollPos,
    dispatch,
    toggles,
    dispatchLoaded,
    setData,
    profile,
    getAxios,
  } = useContext(DataContext);
  useEffect(() => {}, [location.pathname]);
  if (type_ == "none") return null;

  const handleLBtn = (route) => {
    setData([]);
    document
      .querySelector(".section-carousels")
      .scrollTo({ top: 0, behavior: "instant" });
    dispatchLoaded({ type: "home", payload: 5 });
    getAxios(`data/${route}`, { id: profile._id }).then((res) => {
      setData(res.data);
    });
  };

  function handleSearch(e) {
    e?.preventDefault();
    const sec = document.querySelector(".section-carousels");
    if (type_ == "saved") dispatch({ type: type_, payload: sec.scrollTop });
    else if (type_ == "home")
      dispatch({ type: type_, payload: sec?.scrollTop });
    navigate(`/search/${type_}/${query}`);
  }
  function handleSearch2(result) {
    // e?.preventDefault();
    const sec = document.querySelector(".section-carousels");
    if (type_ == "saved") dispatch({ type: type_, payload: sec.scrollTop });
    else if (type_ == "home")
      dispatch({ type: type_, payload: sec?.scrollTop });
    navigate(`/search/${type_}/${result}`);
  }
  return (
    <div className="top-search-bar">
      <form action="" className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => {
            if (!showResults) setShowResults(true);
            setQuery(e.target.value);
          }}
          className="search-bar-input"
          placeholder="Search"
        />
      </form>
      {type_ == "home" && (
        <motion.div
          className="label-buttons"
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 100 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeIn" }}
        >
          <div className="l-btn" onClick={() => handleLBtn("trending")}>
            Trending
          </div>
          <div className="l-btn">Specials</div>
          {toggles.devMode && (
            <>
              <div className="l-btn" onClick={() => handleLBtn("no-name")}>
                No Name&apos;s
              </div>
              <div className="l-btn" onClick={() => handleLBtn("no-title")}>
                No Title&apos;s
              </div>
              <div className="l-btn" onClick={() => handleLBtn("ainf-imgs")}>
                AINF
              </div>
            </>
          )}
        </motion.div>
      )}
      {showResults && <SearchResults name={query} onSelect={handleSearch2} />}
    </div>
  );
}
