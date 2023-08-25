import { createContext, useState, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
let DataContext = createContext();
import Fuse from "fuse.js";
// import datax from "../../withNames.json";
import actress from "../../actress.json";
import datax from "../../data.json";
// import gifs from "../../data/data25.json";

export default function DataProvider({ children }) {
  const [login, setLogin] = useState(true);
  const [signin, setSignin] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [tempLogin, setTempLogin] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [showBars, setShowBars] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [saved, setSaved] = useState(
    JSON.parse(localStorage.getItem("saved")) || []
  );
  // let [selectedData, setSelectedData] = useState()
  // localStorage.clear();
  // Toggle States
  let toggles = JSON.parse(localStorage.getItem("toggles")) || {};

  const [lastImg, setLastImg] = useState(
    toggles?.lastImg !== undefined ? toggles.lastImg : false
  );
  let [slide, setSlide] = useState(
    toggles?.slide !== undefined ? toggles.slide : false
  );
  let [reverseOrder, setReverseOrder] = useState(
    toggles?.reverse !== undefined ? toggles.reverse : false
  );
  let [shuffleSection, setShuffleSection] = useState(
    toggles?.shuffleSection !== undefined ? toggles.shuffleSection : true
  );
  let [shuffleSaved, setShuffleSaved] = useState(
    toggles?.shuffleSaved !== undefined ? toggles.shuffleSaved : false
  );
  let [shuffleSearchResults, setShuffleSearchResults] = useState(
    toggles?.shuffleResults !== undefined ? toggles.shuffleResults : false
  );
  let [persistantScroll, setPersistantScroll] = useState(
    toggles?.persistantScroll !== undefined ? toggles.persistantScroll : false
  );
  let [isCarousel2, setIsCarousel2] = useState(
    toggles?.carousel2 !== undefined ? toggles.carousel2 : true
  );
  let [fromDb, setFromDb] = useState(
    toggles?.fromDb !== undefined ? toggles.fromDb : true
  );
  const [data, setData] = useState([]);
  // let [finalData, setFinalData] = useState(
  //   shuffleSection ? shuffleArray(data) : data
  // );
  const reducer = (state, action) => {
    return { ...state, [action.type]: action.payload };
  };
  const [scrollPos, dispatch] = useReducer(reducer, {
    home: 0,
    saved: 0,
    search: 0,
    videos: 0,
  });
  const [carouselsLoaded, dispatchLoaded] = useReducer(reducer, {
    home: 3,
    saved: 3,
    search: 3,
    videos: 2,
    profile: 2,
    undefined: 1,
  });
  const accFuseRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("saved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    // navigate("/signin");
    checkLoginStatus();
  }, []);

  // Load data from Db
  useEffect(() => {
    console.log(`Signin: ${signin}`);
    if (signin) {
      if (fromDb) {
        // axios.get(`${import.meta.env.VITE_SERVER}/data`).then((res) => {
        //   setData((prv) =>
        //     shuffleSection ? shuffleArray(res.data) : res.data
        //   );
        // });
      } else setData(shuffleSection ? shuffleArray(datax) : datax);
      accFuseRef.current = new Fuse(actress, {
        keys: ["name"],
        threshold: 0.4,
      });
    }
  }, [signin]);

  //  For Profiles
  // useEffect(() => {
  //   setProfiles(
  //     actress.filter((item) => item.count > 0).sort((a, b) => b.count - a.count)
  //   );
  // }, [data]);

  const navigate = useNavigate();

  function checkLoginStatus() {
    const token = localStorage.getItem("token");
    console.log(token);
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
        console.log(res.data);
        if (res.data?.status) {
          setSignin(true);
          setData(res.data.data);
          setProfiles(res.data.profiles);
          // navigate("/x");
        } else if (res.data?.verified == false) {
          navigate("/verify");
        }
      });
  }
  const handlePass = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/login`,
        {
          pass: e.target.pass.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setLogin(true);
          setTimeOut(res.data.timeOut);

          navigate("/home");
        }
      });
  };
  const handleTempPass = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_SERVER}/temp-login`, {
        pass: e.target.pass.value,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          if (wrongPass) setWrongPass(false);
          console.log();
          setTempLogin(true);
          setTimeOut(res.data.timeOut);
          navigate("/");
        } else setWrongPass(true);
      });
  };

  return (
    <DataContext.Provider
      value={{
        login,
        tempLogin,
        timeOut,
        wrongPass,
        setWrongPass,
        setTimeOut,
        setLogin,
        setTempLogin,
        handlePass,
        handleTempPass,
        slide,
        lastImg,
        setLastImg,
        setSlide,
        reverseOrder,
        setReverseOrder,
        shuffleSearchResults,
        shuffleSection,
        setShuffleSearchResults,
        setShuffleSection,
        data,
        setData,
        saved,
        setSaved,
        toggles,
        shuffleSaved,
        setShuffleSaved,
        dispatch,
        scrollPos,
        carouselsLoaded,
        dispatchLoaded,
        persistantScroll,
        setPersistantScroll,
        isCarousel2,
        setIsCarousel2,
        showBars,
        accFuseRef,
        fromDb,
        setFromDb,
        setShowBars,
        profiles,
        signin,
        setSignin,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { DataContext };
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  // setLoadedCarousels(4);
  return array;
}
