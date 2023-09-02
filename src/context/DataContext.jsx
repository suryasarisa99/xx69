import { createContext, useState, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import actress from "../../actress.json";

let DataContext = createContext();

export default function DataProvider({ children }) {
  const [signin, setSignin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showBars, setShowBars] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [data, setData] = useState([]);

  const accFuseRef = useRef(null);
  const navigate = useNavigate();

  let tg = JSON.parse(localStorage.getItem("toggles")) || {};
  const reducer = (state, action) => {
    return { ...state, [action.type]: action.payload };
  };

  // * UseReducers
  // Toggle Reducers
  const [toggles, dispatchToggles] = useReducer(reducer, {
    lastImg: createTg("lastImg", false),
    slide: createTg("slide", false),
    reverseOrder: createTg("reverseOrder", false),
    shuffleSaved: createTg("shuffleSaved", false),
    shuffleSearchResults: createTg("shuffleSearchResults", false),
    persistantScroll: createTg("persistantScroll", false),
    isCarousel2: createTg("isCarousel2", true),
    fuzzySearch: createTg("fuzzySearch", true),
    devMode: createTg("devMode", false),
  });
  // ScrollPos Reducer
  const [scrollPos, dispatch] = useReducer(reducer, {
    home: 0,
    saved: 0,
    search: 0,
    videos: 0,
  });
  // caroseles Reducer
  const [carouselsLoaded, dispatchLoaded] = useReducer(reducer, {
    home: 4,
    saved: 3,
    search: 3,
    videos: 2,
    profile: 2,
    undefined: 1,
  });

  const fetching = useRef({
    saved: 0,
    profiles: 0,
    videos: 0,
  });
  // 0 - not fetched, 1 - fetching, 2- fetch completed

  // * Use Effect
  useEffect(() => {
    console.log(`Signin: ${signin}`);
    if (signin) {
      accFuseRef.current = new Fuse(actress, {
        keys: ["name"],
        threshold: 0.4,
      });
    }
  }, [signin]);
  useEffect(() => {
    // navigate("/signin");
    checkLoginStatus();
  }, []);

  // const { x } = useFetching();
  // * Helper Functions
  function createTg(key, defaultValue) {
    return tg?.[key] !== undefined ? tg[key] : defaultValue;
  }

  function fetchOtherData(id) {
    if (fetching.current.saved == 0) {
      fetching.current.saved = 1;
      getAxios("data/saved", { id }).then((res) => {
        fetching.current.saved = 2;
        console.log("fetching saved - from DC");
        setSaved(res.data);
        setSavedIds(res.data.map((s) => s._id));
      });
    }
    if (fetching.current.profiles == 0) {
      fetching.current.profiles = 1;
      getAxios("data/profiles").then((res) => {
        console.log("fetching profiles - from DC");
        fetching.current.profiles = 2;
        setProfiles(res.data);
      });
    }
  }

  function checkLoginStatus() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_SERVER}/auth/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.status) {
          setSignin(true);
          setData(res.data.data);
          setProfile(res.data.profile);
          setTimeout(() => {
            console.log("<== started Fetch ==>");
            fetchOtherData(res.data.profile._id);
          }, 800);
          // time gap for stop fetching immediately, and to load home images
        } else if (res.data?.verified == false) {
          navigate("/verify");
        }
      });
  }

  function getAxios(url, body) {
    if (body) return axios.post(`${import.meta.env.VITE_SERVER}/${url}`, body);
    return axios.get(`${import.meta.env.VITE_SERVER}/${url}`, body);
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        saved,
        setSaved,
        scrollPos,
        dispatch,
        carouselsLoaded,
        dispatchLoaded,
        showBars,
        accFuseRef,
        setShowBars,
        profiles,
        setProfiles,
        signin,
        setSignin,
        savedIds,
        setSavedIds,
        gifs,
        setGifs,
        profile,
        setProfile,
        tg,
        toggles,
        dispatchToggles,
        fetching,
        // dispatchFetch,
        getAxios,
        shuffleArray,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
