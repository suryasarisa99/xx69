import React, { useState, useEffect, useRef, useContext } from "react";
import actress from "../../actress.json";
import { DataContext } from "../context/DataContext";
import { FaSearch, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Suggest({ name, onSelect }) {
  const [data, setData] = useState([]);
  const [fuzzyResult, setFuzzyResult] = useState([]);

  const { accFuseRef } = useContext(DataContext);

  let nameWords = name.toLowerCase().trim().split(" ");
  nameWords = nameWords.map((item) => item.trim().replace(/[^\x20-\x7E]/g, ""));
  const [query, setQuery] = useState("");
  let exactMatchFound = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    exactMatchFound.current = false;
    setData([]);
    const fdata = actress
      .map((item, ind) => {
        const itemWords = item.words ?? item.name.toLowerCase().split(" ");
        const actualWordsLen = item.name.toLowerCase().split(" ").length;
        const matchingWords = itemWords.filter((word) =>
          nameWords.includes(word)
        );
        if (matchingWords.lnegth > 1)
          console.log("matched words", matchingWords);
        const exactMatch =
          actualWordsLen == nameWords.length &&
          actualWordsLen == matchingWords.length;
        if (exactMatch) exactMatchFound.current = true;
        let partialMatch = false;
        if (!exactMatchFound.current) {
          partialMatch =
            actualWordsLen == matchingWords.length || matchingWords.length >= 2;
        }
        return {
          ...item,
          exactMatch,
          partialMatch,
          ind,
          // actualWordsLen,
          // w: matchingWords,
          // aw: itemWords,
          matchingWords: matchingWords.length,
        };
      })
      .filter((item) => item.matchingWords > 0)
      .sort((a, b) => b.matchingWords - a.matchingWords);

    setTimeout(() => setData(fdata), 1);
    setFuzzyResult(
      accFuseRef.current
        .search(name)
        .map((item) => item.item)
        .splice(0, 15)
    );
  }, [name]);

  useEffect(() => {
    setQuery("");
  }, []);

  // useEffect(() => {
  //   if (query) {
  //     setData([]);
  //     const fdata = accFuseRef.current.search(query).map((item) => item.item);
  //     setTimeout(() => setFuzzyResult(fdata), 2);
  //  }
  // }, [query]);

  return (
    <div className="suggestions" onClick={(e) => e.stopPropagation()}>
      <div className="name">
        <p>Name: {name}</p>
        <Items name={name} />
      </div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          if (query) {
            setData([]);
            const fdata = accFuseRef.current
              .search(query)
              .map((item) => item.item);
            setFuzzyResult(fdata);
            // setTimeout(() => setFuzzyResult(fdata), 1);
          }
        }}
      >
        <input
          type="text"
          placeholder="search"
          value={query}
          onClick={(e) => e.stopPropagation()}
          // autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {/* <h2>Suggested Actresses:</h2> */}
      {fuzzyResult.length > 0 && (
        <div className="fuzzy-results">
          <p className="title">Fuzzy Results</p>
          {fuzzyResult.map((item, ind) => (
            <div key={item.name + "" + ind} onClick={() => onSelect(item.name)}>
              <div
                className={
                  "sugg-item "
                  // (item.exactMatch ? "exact-match " : "") +
                  // (item.partialMatch ? "partial-match " : "")
                }
              >
                <div>{item.name}</div>
                <Items name={item.name} />
              </div>
            </div>
          ))}
        </div>
      )}
      {data.length > 0 && (
        <div className="normal-results">
          <div className="title">Normal Results</div>
          {data.map((item, ind) => (
            <div key={item.name + "" + ind} onClick={() => onSelect(item.name)}>
              {/* <p>
            m:{item.matchingWords} a:{item.actualWordsLen}
          </p>
          {item.w.map((it, index) => {
            return <p key={it + " " + index}>{it}</p>;
          })} */}

              <div
                className={
                  "sugg-item " +
                  (item.exactMatch ? "exact-match " : "") +
                  (item.partialMatch ? "partial-match " : "")
                }
              >
                <p>{item.name}</p>
                <Items name={item.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual

function Items({ name }) {
  const navigate = useNavigate();
  return (
    <div className="items">
      <button
        onClick={(e) => {
          e.stopPropagation();
          // document
          //   .getElementById("overlay")
          //   .classList.add("hidden");
          open(`https://www.google.com/search?q=${name}`);
        }}
      >
        <FaGoogle />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          // open(`http://192.168.0.169:4444/search/${"home"}/${name}`);
          // open(`https://x69.vercel.app/search/${"home"}/${name}`);
          navigate(`/search/${"home"}/${name}`);
          document.getElementById("overlay").classList.add("hidden");
        }}
      >
        <FaSearch />
      </button>
    </div>
  );
}
