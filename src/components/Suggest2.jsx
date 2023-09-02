import React, { useState, useEffect, useRef, useContext } from "react";
import actress from "../../actress.json";
// import Fuse from "fuse.js";
import { DataContext } from "../context/DataContext";
export default function Suggest({ name, onSelect }) {
  const [data, setData] = useState([]);
  const { accFuseRef } = useContext(DataContext);
  const [query, setQuery] = useState("");
  useEffect(() => {
    setData([]);
    const fdata = accFuseRef.current.search(name).map((acc) => acc.item);
    console.log(fdata);

    setTimeout(() => setData(fdata), 1);
  }, [name]);

  useEffect(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    if (query) {
      let fdata = accFuseRef.current.search(query);
      console.log(fdata);
      fdata = fdata.map((acc) => acc.item);
      setData([]);
      setTimeout(() => setData(fdata), 0.1);
    }
  }, [query]);

  return (
    <div className="suggestions" onClick={(e) => e.stopPropagation()}>
      <p className="name">Name: {name}</p>
      <form action="">
        <input
          type="text"
          placeholder="search"
          value={query}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {/* <h2>Suggested Actresses:</h2> */}
      {data.map((item, ind) => (
        <div key={item.name + "" + ind} onClick={() => onSelect(item.name)}>
          <p
            className={
              "sugg-item "
              // +
              // (item.exactMatch ? "exact-match " : "") +
              // (item.partialMatch ? "partial-match " : "")
            }
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual
