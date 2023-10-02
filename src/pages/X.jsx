import Admin from "../auth/Admin";
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
import Profiles from "../profile/Profiles";
import { motion, AnimatePresence } from "framer-motion";
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
    case "/x":
    case "/x/":
    case "/x/home":
      searchType = "home";
  }

  return (
    <div className="x">
      <AnimatePresence>
        {showBars && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: -3, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="xyx"
          >
            <SearchBar type_={searchType} />
          </motion.div>
        )}
      </AnimatePresence>
      <Routes className="xxx">
        <Route path="*" element={<Home setShowBars={setShowBars} />} />
        <Route path="/videos" element={<Videos setShowBars={setShowBars} />} />
        <Route path="/saved" element={<Saved setShowBars={setShowBars} />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {/* <div className="desktop-nav">hello hi</div> */}
      <AnimatePresence>
        {showBars && (
          <motion.div
            className="bottom-xyx"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            exit={{ y: 30 }}
            // exit={{ opacity: !showBars ? 0 : 100 }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
          >
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>
      <SideNav />
    </div>
  );
}

// initial={{ opacity: showBars ? 0 : 100 }}
//           transition={{ opacity: showBars ? 100 : 0 }}
