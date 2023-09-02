import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { BsShareFill } from "react-icons/bs";
import "./style.scss";
import _throttle from "lodash/throttle";
import { motion, AnimatePresence } from "framer-motion";
import LoadingCard from "./LoadingCard";
import LoadingImg from "./LoadingImg";
import Carousel1 from "./Carousel1";
import Carousel2 from "./Carousel2";
import PostBottom from "./PostBottom";
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
}) {
  const { getAxios, toggles } = useContext(DataContext);
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

  let [selected, setSelected] = useState(0);
  let [len, setLen] = useState(
    Array.from({ length: item.images.length }, () => {
      return {};
    })
  );

  useEffect(() => {
    loadAllImgs(item.images);
  }, []);

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
    <div className="post">
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
