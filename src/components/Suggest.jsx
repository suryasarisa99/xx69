import React, { useState, useEffect, useRef, useContext } from "react";
import actressx from "../../actress.json";
import { DataContext } from "../context/DataContext";
import { FaSearch, FaGoogle } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import useProfileImg from "../../hooks/useProfileImg";

export default function Suggest({ name, onSelect, img, forceClose }) {
  const [data, setData] = useState([]);
  const [fuzzyResult, setFuzzyResult] = useState([]);
  const [profileName, setProfileName] = useState(name);
  const [profileImg, setProfileImg] = useState(img);
  const { accFuseRef } = useContext(DataContext);
  useProfileImg(setProfileImg, profileName);

  let nameWords = name.toLowerCase().trim().split(" ");
  nameWords = nameWords.map((item) => item.trim().replace(/[^\x20-\x7E]/g, ""));
  const [query, setQuery] = useState("");
  let exactMatchFound = useRef(false);
  console.log(actressx);
  useEffect(() => {
    exactMatchFound.current = false;
    setData([]);
    const fdata = actressx
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
          matchingWords: matchingWords.length,
        };
      })
      .filter((item) => item.matchingWords > 0)
      .sort((a, b) => b.matchingWords - a.matchingWords);

    setTimeout(() => setData(fdata), 1);
    const fsData = accFuseRef.current.search(name).map((item) => item.item);
    console.log(fsData);
    setFuzzyResult(
      fsData
      // .slice(0, 15)
    );
  }, [name]);

  useEffect(() => {
    setQuery("");
  }, []);

  const updateProfileCard = (name, img) => {
    setProfileName(name);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      setData([]);
      const fdata = accFuseRef.current.search(query).map((item) => item.item);
      setFuzzyResult(fdata);
    }
  };

  return (
    <div className="suggestions" onClick={(e) => e.stopPropagation()}>
      <div className="name">
        <p>{profileName}</p>
      </div>
      <ProfileCard
        name={profileName}
        img={profileImg}
        forceClose={forceClose}
      />

      <form action="" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="search"
          value={query}
          onClick={(e) => e.stopPropagation()}
          // autoFocus
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e);
          }}
        />
      </form>
      {/* <h2>Suggested Actresses:</h2> */}
      {fuzzyResult.length > 0 && (
        <div className="fuzzy-results">
          <p className="title">Fuzzy Results</p>
          <div className="items-con">
            {fuzzyResult.map((item, ind) => (
              <div
                key={item.name + "" + ind}
                onClick={() => onSelect(item.name)}
              >
                <div className={"sugg-item "}>
                  <div>{item.name}</div>
                  <Items
                    name={item.name}
                    updateProfileCard={updateProfileCard}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.length > 0 && (
        <div className="normal-results">
          <div className="title">Normal Results</div>
          <div className="items-con">
            {data.map((item, ind) => (
              <div
                key={item.name + "" + ind}
                onClick={() => onSelect(item.name)}
              >
                <div
                  className={
                    "sugg-item " +
                    (item.exactMatch ? "exact-match " : "") +
                    (item.partialMatch ? "partial-match " : "")
                  }
                >
                  <p>{item.name}</p>
                  <Items
                    name={item.name}
                    updateProfileCard={updateProfileCard}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Aishwarya lekshmi, ivana, annu emmanual

function Items({ name, updateProfileCard }) {
  const navigate = useNavigate();
  return (
    <div className="items">
      <button
        onClick={(e) => {
          e.stopPropagation();
          open(`https://www.google.com/search?q=${name}`);
        }}
      >
        <FaGoogle />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/search/${"home"}/${name}`);
          document.getElementById("overlay").classList.add("hidden");
        }}
      >
        <FaSearch />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateProfileCard(name);
        }}
      >
        <BsArrowRight className="right-arrow" />
      </button>
    </div>
  );
}
