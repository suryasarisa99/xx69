import { createContext, useState, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fuse from "fuse.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseConfig.js";
import actressx from "../../actress.json";
let DataContext = createContext();
import { auth } from "../../firebaseConfig.js";

export default function DataProvider({ children }) {
  const [signin, setSignin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showBars, setShowBars] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [gifs, setGifs] = useState([]);
  const [data, setData] = useState([]);
  const [actress, setActress] = useState([]);
  const [profileImgs, setProfileImgs] = useState([]);
  const [homeSubType, setHomeSubType] = useState("home");
  const [postsData, setPostsData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [blur, setBlur] = useState(true);

  const accFuseRef = useRef(null);
  const navigate = useNavigate();

  let tg = JSON.parse(localStorage.getItem("toggles")) || {};
  const reducer = (state, action) => {
    if (action.type == "profile")
      return {
        ...state,
        [action.type]: { ...state[action.type], ...action.payload },
      };
    else return { ...state, [action.type]: action.payload };
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
    blur: createTg("blur", true),
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
    profile: null,
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
      accFuseRef.current = new Fuse(actressx, {
        keys: ["name"],
        threshold: 0.4,
      });
    }
  }, [signin]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) {
        getData(user.uid);
      } else navigate("/test");
      console.log("xxx user xxxx");
      console.log(user);
    });
  }, [auth]);

  useEffect(() => {
    // navigate("/signin");
    // checkLoginStatus();
    // getData();
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

  function getData(id) {
    getAxios("auth/my-data", { uid: id }).then((res) => {
      if (res.data?.status) {
        setSignin(true);
        setData(res.data.data);
        // setProfile(res.data.profile);
        setActress(res.data.actress);
        console.log(res.data.actress);
        getAllImgs(res.data.actress);
        setTimeout(() => {
          console.log("<== started Fetch ==>");
          fetchOtherData(id);
        }, 800);
      }
    });
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
          setActress(res.data.actress);
          console.log(res.data.actress);
          getAllImgs(res.data.actress);
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
  function getAllImgs(images) {
    const promises = images.map((img) => {
      let ImgRef = ref(storage, `xdps/${img._id}_r_md.jpg`);
      return getDownloadURL(ImgRef)
        .then((url) => ({
          name: img._id,
          url: url,
          // [img._id]: url,
        }))
        .catch((error) => {
          console.error("Error fetching image:", error);
          return null; // Return null if there was an error so you can filter it out later.
        });
    });

    Promise.all(promises)
      .then((imageDataArray) => {
        const validImageData = imageDataArray.filter((data) => data !== null);
        setProfileImgs(validImageData);
        console.log(validImageData);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
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
        actress,
        setActress,
        profileImgs,
        setProfileImgs,
        postsData,
        setPostsData,
        homeSubType,
        setHomeSubType,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
