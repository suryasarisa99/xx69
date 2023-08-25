import React, { useState, useEffect, useRef, useContext } from "react";
import actress from "../../actress.json";
import { DataContext } from "../context/DataContext";
export default function SearchResults({ name, onSelect }) {
  const [data, setData] = useState([]);
  const { accFuseRef } = useContext(DataContext);
  let exactMatchFound = useRef(false);
  useEffect(() => {
    exactMatchFound.current = false;
    setData([]);
    // const results = actress.filter((item) =>
    //   item.name.toLowerCase().includes(name.toLowerCase())
    // );
    const results = accFuseRef.current
      .search(name)
      .map((item) => item.item)
      .slice(0, 7);
    setTimeout(() => {
      setData(results);
    }, 3);
  }, [name]);

  //   console.log(data);

  return (
    <div className="search-results">
      {data.map((item) => (
        <div key={item.name}>
          <p className={"sugg-item"} onClick={() => onSelect(item.name)}>
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual
