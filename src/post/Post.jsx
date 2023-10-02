import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
// import "./style.scss";
import _throttle from "lodash/throttle";
import { motion, AnimatePresence } from "framer-motion";
import Carousel1 from "./Carousel1";
import Carousel2 from "./Carousel2";
import PostBottom from "../post/PostBottom";
import storage from "../../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useProfileImg from "../../hooks/useProfileImg";
export default function Post({
  onSwipe,
  onShare,
  id,
  addLike,
  cIndex,
  removeLike,
  type_,
  showSuggestions,
  item,
  showProfile,
  postRef,
}) {
  const { getAxios, toggles, profileImgs } = useContext(DataContext);
  let [smallScreen, setSmallScreen] = useState(false);
  let [heart, setHeart] = useState(false);
  let [SM, setSM] = useState(false);
  let [noImaes, setNoImages] = useState(false);
  const likeRef = useRef(null);
  // let [images, setImages] = useState(
  //   toggles.reverseOrder ? [...item.images].reverse() : item.images
  // );
  let [imgLoaded, setImgLoaded] = useState(
    Array.from({ length: item.images.length }, () => false)
  );

  const dotClickRef = useRef(false);
  let [imgUrl, setImgUrl] = useState();

  let [selected, setSelected] = useState(0);
  let [len, setLen] = useState(
    Array.from({ length: item.images.length }, () => {
      return {};
    })
  );

  useEffect(() => {
    loadAllImgs(item.images);
  }, []);
  useProfileImg(setImgUrl, item.name);

  function imgRatio() {
    const thresold = 0.14;
    let hlen = 0;
    //  to find max ratio
    for (let i = 1; i < len.length; i++)
      if (len[hlen].h / len[hlen].w < len[i].h / len[i].w) hlen = i;

    // for individual img resizer
    for (let i = 0; i < len.length; i++) {
      if (len[hlen].h / len[hlen].w - len[i].h / len[i].w > thresold) {
        len[i].show = true;
      }
    }
    setLen([...len]);
    //  imgResizer for complete carousel
    // for (let i = 0; i < len.length; i++) {
    //   if (len[hlen].h / len[hlen].w - len[i].h / len[i].w > thresold) {
    //     setShowImgSizer(true);
    //     break;
    //   }
    // }
  }

  function AINF() {
    // All Images Not Found
    let isAINF = true;
    for (let i = 0; i < len.length; i++) {
      if (len[i].h != 180 || len[i].w != 180) {
        isAINF = false;
        break;
      }
    }
    if (isAINF) {
      setNoImages(true);
      getAxios("data/ainf", { id: id });
    }
  }
  const handleBigHeart = () => {
    setHeart(true);
    if (likeRef.current) likeRef.current.click();
    setTimeout(() => {
      setSM(true);
    }, 100);
    setTimeout(() => {
      setHeart(false);
      setSM(false);
    }, 1000);
  };

  function loadAllImgs(images) {
    images.forEach((img, ind) => {
      loadImage(img).then((img) => {
        imgLoaded[ind] = true;
        setImgLoaded([...imgLoaded]);
        len[ind] = {
          w: img.width,
          h: img.height,
        };
        setLen([...len]);
        if (images.length > 0) imgRatio();
        AINF();
      });
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;

      image.onload = () => {
        resolve(image);
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(() => {
    console.log(postRef?.current);
  }, [postRef]);

  if (noImaes && !toggles.devMode) return null;

  if (!item.images || item.images.length == 0) return null;
  const p = {
    item,
    id: item._id,
    len,
    selected,
    setSelected,
    smallScreen,
  };
  return (
    <div className="post" id={id} ref={postRef}>
      <div className="top-profile-bar">
        <div className="pink-border">
          <div className="img-box">
            <img src={imgUrl} alt="" />
          </div>
        </div>
        <div
          onClick={() => {
            if (toggles.devMode) {
              showSuggestions({
                title: item?.name || item?.title,
                id,
                img: imgUrl,
              });
            } else
              showProfile({
                title: item?.name || item?.title,
                id,
                img: imgUrl,
              });
          }}
        >
          {item?.name && <div className="name">{item.name}</div>}
          {!item?.name && item.title && (
            <div className="title">{item?.title}</div>
          )}
          {!item?.name && !item?.title && (
            <div className="no-name">No Name </div>
          )}
        </div>
      </div>
      {toggles.isCarousel2 ? (
        <Carousel2
          p={p}
          handleBigHeart={handleBigHeart}
          cIndex={cIndex}
          onSwipe={onSwipe}
          heart={heart}
          SM={SM}
          imgLoaded={imgLoaded}
        />
      ) : (
        <Carousel1
          p={p}
          handleBigHeart={handleBigHeart}
          cIndex={cIndex}
          onSwipe={onSwipe}
          heart={heart}
          SM={SM}
          imgLoaded={imgLoaded}
        />
      )}
      <PostBottom
        p={p}
        onShare={onShare}
        likeRef={likeRef}
        addLike={addLike}
        removeLike={removeLike}
        showSuggestions={showSuggestions}
        setSmallScreen={setSmallScreen}
      />
    </div>
  );
}
