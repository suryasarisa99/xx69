import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import SearchBar2 from "../components/SearchBar2";
import Fuse from "fuse.js";
import actressX from "../../actress.json";
export default function Profiles() {
  const { profiles } = useContext(DataContext);
  const [query, setQuery] = useState("");
  // const [profiles, setProfiles] = useState([]);
  const pFuse = new Fuse(profiles, { threshold: 0.4, keys: ["name"] });

  let actress = useRef(null);
  let totalVerCarousels = useRef(0);
  const navigate = useNavigate();

  function queryOnChange(q) {
    setQuery(q);
    scrollTo({ top: 0 });
  }

  return (
    <div className="profiles">
      <SearchBar2 query={query} onChange={queryOnChange} />
      <div className="flex-items">
        <p className="profile-item">
          Total Posts: <span>31,204</span>
        </p>
        <p className="profile-item">
          Total Pics: <span>65,791</span>{" "}
        </p>
      </div>
      {(query ? pFuse.search(query).map((item) => item.item) : profiles).map(
        (profile) => {
          return (
            <div
              className="profile-item"
              key={profile.name}
              onClick={() => navigate("/profile/" + profile.name)}
            >
              <p className="name">{profile.name}</p>
              <p className="count">{profile.count}</p>
            </div>
          );
        }
      )}
    </div>
  );
}
