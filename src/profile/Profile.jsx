import { useState, useContext, useRef, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";
import { GrGrid } from "react-icons/gr";
import Section from "../pages/Section";
import axios from "axios";
import ProfileView from "./ProfileView";
import { BiMoviePlay } from "react-icons/bi";
import { BsGrid3X3, BsArrowLeft } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
export default function Profile() {
  const { name } = useParams();
  const {
    carouselsLoaded,
    dispatchLoaded,
    currentUser,
    actress,
    profileImg,
    postsData,
    setPostsData,
  } = useContext(DataContext);
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showGifs, setShowGifs] = useState(false);
  const switchBarRef = useRef(null);
  const postsViewRef = useRef(null);
  const gifsViewRef = useRef(null);
  const profileScrollRef = useRef(null);

  // const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    if (postsData[name]) {
      const actor = actress.find((item) => item._id == name);

      if (actor) {
        setProfilePhoto(actor.img);
      } else {
        const pic =
          postsData[name].posts?.[
            Math.floor(Math.random() * postsData[name].posts.length)
          ]?.images[0];
        setProfilePhoto(pic);
      }
    }
    // setPostsData([]);
    scrollTo({ top: 0, behavior: "instant" });
    async function fetchData() {
      const fData = (
        await axios.post(
          `${import.meta.env.VITE_SERVER}/data/profile/${name}`,
          {
            id: currentUser.uid,
          }
        )
      ).data;
      console.log(fData);
      const actor = actress.find((item) => item._id == name);
      if (actor) {
        console.log(actor.img);
        setProfilePhoto(actor.img);
      } else {
        const pic =
          fData?.[Math.floor(Math.random() * fData.length)]?.images[0];
        setProfilePhoto(pic);
      }

      const posts = fData.filter((item) => !item.images[0].endsWith(".gif"));
      const gifs = fData.filter((item) => item.images[0].endsWith(".gif"));

      setPostsData((prv) => ({ ...prv, [name]: { posts, gifs } }));
    }
    fetchData();
    dispatchLoaded({ type: "profile", payload: 2 });
  }, [name, currentUser]);

  useEffect(() => {
    const handleScroll = (e) => {
      if (scrollY >= 18) {
        switchBarRef?.current?.classList?.add("fixed-bar");
      } else if (scrollY < 186)
        switchBarRef?.current?.classList?.remove("fixed-bar");
    };
    window.addEventListener("scroll", handleScroll);
    // profileScrollRef.current?.addEventListener("scroll", sample);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const howToLoadData = {
    initial: carouselsLoaded.profile || 3,
    load: 3,
    carouselsLoaded,
    dispatchLoaded,
    swipeOnLast: 2,
    type_: "profile",
    total: postsData.length,
  };

  const ProfileViewOfPosts = (
    <ProfileView
      data={postsData?.[name]?.posts}
      setData={setPostsData}
      howToLoadData={howToLoadData}
      type_="profile"
      data_type={"posts"}
      name={name}
      viewRef={postsViewRef}
    />
  );

  const ProfileViewOfGifs = (
    <ProfileView
      data={postsData?.[name]?.gifs}
      setData={setPostsData}
      howToLoadData={howToLoadData}
      type_="profile"
      data_type="gifs"
      name={name}
      viewRef={gifsViewRef}
    />
  );

  function sample() {
    // console.log("$$$$$$$$$$$$$$$$");
    const scrollCon = profileScrollRef.current;
    const scrollItems = scrollCon?.querySelectorAll(".profile-scroll-item");
    // console.log(scrollItems.length);
    for (let i = 0; i < scrollItems.length; i++) {
      const item = scrollItems[i];
      let condition = parseInt(
        Math.abs(
          item.getBoundingClientRect().left -
            scrollCon.getBoundingClientRect().left
        )
      );
      let thresold = parseInt(item.offsetWidth / 2);
      console.log(`condition: ${condition} || thresold: ${thresold}`);
      if (condition <= thresold && condition >= -10) {
        if (i == 0) setShowGifs(false);
        else setShowGifs(true);
        break;
      }
    }
  }

  return (
    <div className="profile">
      <div className="head-bar">
        <div className="back-btn-outer" onClick={() => navigate(-1)}>
          <BsArrowLeft className="back-btn-x" />
        </div>
        <div className="flex">
          <p className="name">{name}</p>
          <p className="icon ">
            <MdVerified className="verfied" />
          </p>
        </div>
      </div>
      <div className="main">
        <div className="image-container">
          <img src={profilePhoto} alt="" className="img" />
        </div>
        <div className="about">
          <p className="count">
            posts:{" "}
            {postsData?.[name]?.posts?.length + postsData?.[name]?.gifs?.length}
          </p>
          <button
            className="google-search"
            onClick={() => open("https://www.google.com/search?q=" + name)}
          >
            Search In Google
          </button>
        </div>
      </div>

      {/* <Section
        data={postsData}
        setData={setPostsData}
        howToLoadData={howToLoadData}
        type_="profile"
      /> */}
      <div className="switch-bar" ref={switchBarRef}>
        <p
          className={!showGifs ? "selected" : ""}
          onClick={() => {
            setShowGifs(false);

            // document
            //   .querySelector(".profile-scroll")
            //   .scrollBy({ left: -400, behavior: "smooth" });
          }}
        >
          <BsGrid3X3 className={"icon grid"} />
        </p>
        <p
          className={showGifs ? "selected" : ""}
          onClick={() => {
            setShowGifs(true);
            // document
            //   .querySelector(".profile-scroll")
            //   .scrollBy({ left: 400, behavior: "smooth" });
          }}
        >
          <BiMoviePlay className={"icon video"} />
        </p>
      </div>

      {/* {
        <div className="profile-scroll" ref={profileScrollRef}>
          <div className="profile-scroll-item">{ProfileViewOfPosts}</div>
          <div className="profile-scroll-item">{ProfileViewOfGifs}</div>
        </div>
      } */}
      {!showGifs ? (
        <div>{ProfileViewOfPosts}</div>
      ) : (
        <div>{ProfileViewOfGifs}</div>
      )}
    </div>
  );
}
