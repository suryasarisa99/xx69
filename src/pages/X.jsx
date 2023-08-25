import Admin from "./Admin";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import SearchBar from "../components/SearchBar";
import Videos from "./Videos";
import Saved from "./Saved";
import Settings from "./Settings";
import { DataContext } from "../context/DataContext";
import Home from "./Home";
import SearchResults from "../components/SearchResults";
import SideNav from "../components/SideNav";
import Profiles from "./Profiles";
export default function X() {
  const navigate = useNavigate();
  const { showBars, setShowBars, signin } = useContext(DataContext);
  const { suggestions, setShowSuggestions } = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowBars(true);
  }, [location.pathname]);

  // if (!signin) navigate("/signin");

  // useEffect(() => {
  //   if (!signin) return null;
  // }, [signin]);

  let searchType = "";
  switch (location.pathname) {
    case "/x/saved":
      searchType = "saved";
      break;
    case "/x/settings":
    case "/x/profiles":
      searchType = "none";
      break;
    case "/x/videos":
      searchType = "gifs";
      break;
    case "/":
    case "/x/home":
      searchType = "home";
  }

  return (
    <div className="x">
      {showBars && <SearchBar type_={searchType} />}
      <Routes>
        <Route path="*" element={<Home setShowBars={setShowBars} />} />
        <Route path="/videos" element={<Videos setShowBars={setShowBars} />} />
        <Route path="/saved" element={<Saved setShowBars={setShowBars} />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <SideNav />
      {/* <div className="desktop-nav">hello hi</div> */}
      {showBars && <BottomNav />}
    </div>
  );
}
