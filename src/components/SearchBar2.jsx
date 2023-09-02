import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import SearchResults from "./SearchResults";
export default function SearchBar2({ onChange, query }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showResults, setShowResults] = useState(false);
  const { scrollPos, dispatch } = useContext(DataContext);
  useEffect(() => {}, [location.pathname]);
  //   console.log(onChange);
  return (
    <div className="search-bar-2">
      {/* <form action="" className="search-bar" onSubmit={handleSearch}> */}
      <input
        type="text"
        name="query"
        value={query}
        // onChange={(e) => {
        //   if (!showResults) setShowResults(true);
        //   setQuery(e.target.value);
        // }}
        onChange={(e) => onChange(e.target.value)}
        className="search-bar-input"
        placeholder="Search"
      />
      {/* </form> */}
      {/* {showResults && <SearchResults name={query} onSelect={handleSearch2} />} */}
    </div>
  );
}
