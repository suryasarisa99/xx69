import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { BsShareFill } from "react-icons/bs";
import "./style.scss";
import { motion, AnimatePresence } from "framer-motion";
import LoadingCard from "./LoadingCard";
import LoadingImg from "./LoadingImg";
export default function Carousel({
  onSwipe,
  onShare,
  id,
  addLike,
  cIndex,
  removeLike,
  type_,
  showSuggestions,
  removeCarouselFromSaved,
  fetchImages,
  item,
}) {
  const {
    slide,
    lastImg,
    profile,
    reverseOrder,
    saved,
    setSaved,
    getAxios,
    savedIds,
    toggles,
    setSavedIds,
  } = useContext(DataContext);
  let [isSaved, setIsSaved] = useState(savedIds.includes(id));
  let [smallScreen, setSmallScreen] = useState(false);
  let [showImgSizer, setShowImgSizer] = useState(false);
  let [like, setLike] = useState(item.likeStatus);
  let [likesCount, setLikesCount] = useState();
  let [heart, setHeart] = useState(false);
  let [SM, setSM] = useState(false);
  let [noImaes, setNoImages] = useState(false);
  let [DH, setDH] = useState(false);
  const likeRef = useRef(null);
  const imgConRef = useRef(null);
  let [images, setImages] = useState(
    reverseOrder ? [...item.images].reverse() : item.images
  );
  let [imgLoaded, setImgLoaded] = useState(
    Array.from({ length: item.images.length }, () => false)
  );
  let [len, setLen] = useState(
    Array.from({ length: item.images.length }, () => {
      return {};
    })
  );

  let [selected, setSelected] = useState(lastImg ? images.length - 1 : 0);

  useEffect(() => {
    images.forEach((img, ind) => {
      loadImage(img).then((img) => {
        imgLoaded[ind] = true;
        setImgLoaded([...imgLoaded]);
        len[ind] = {
          w: img.width,
          h: img.height,
        };
        setLen([...len]);
        if (images.length > 0) sample();
        AINF();
      });
    });

    function sample() {
      const thresold = 0.14;
      let hlen = 0;
      for (let i = 1; i < len.length; i++)
        if (len[hlen].h / len[hlen].w < len[i].h / len[i].w) hlen = i;
      // for (let i = 0; i < len.length; i++) {
      //   if (len[hlen].h - len[i].h > thresold) {
      //     len[i].show = true;
      //   }
      // }
      // setLen([...len]);
      for (let i = 0; i < len.length; i++) {
        if (len[hlen].h / len[hlen].w - len[i].h / len[i].w > thresold) {
          setShowImgSizer(true);
          break;
        }
      }
    }

    function AINF() {
      // All Images Not Found
      console.log();
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

    //* Likes Count
    if (!isNaN(+item.likes)) setLikesCount(item.likes);
    else {
      console.log(` errorInLikes: ${item.likes}`);
      let x = getAxios("data/re-get-likes", {
        itemId: id,
        accId: profile._id,
      }).then((res) => {
        setLikesCount(res.data.likes);
      });
    }
  }, []);

  if (noImaes) return null;

  if (!images || images.length == 0) return null;
  const onDotClick = (index) => {
    setSelected(index);
  };
  const addBookMark = () => {
    setIsSaved(true);
    getAxios("data/save", { id: profile._id, savedId: id });
    setSaved((prv) => [...prv, item]);
    setSavedIds((prv) => [...prv, id]);
  };
  const removeBookMark = () => {
    getAxios("data/unsave", { id: profile._id, savedId: id });
    setIsSaved(false);
    setSaved((prv) => prv.filter((s) => s._id != id));
    setSavedIds((prv) => prv.filter((sid) => sid != id));
  };
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

  return (
    <div
      className="carousel carousel2"
      onTouchStart={onSwipe}
      onMouseOverCapture={onSwipe}
    >
      <div className="images-container" ref={imgConRef}>
        {images.map((image, index) => {
          return (
            <div key={index + id} className="img-box">
              {toggles.devMode && (
                <div className="temp">
                  <p>
                    H: {len[index].h} W:{len[index].w}
                  </p>
                </div>
              )}
              {imgLoaded[index] ? (
                <motion.img
                  // initial={{ scale: 0.8 }}
                  // whileInView={{
                  //   scale: 1,
                  // }}
                  // transition={{ duration: 0.6, ease: "easeInOut" }}
                  key={index + id}
                  src={image}
                  alt={item?.name || item?.title || "x-img"}
                  onDoubleClick={handleBigHeart}
                  style={{ objectFit: smallScreen ? "contain" : "cover" }}
                ></motion.img>
              ) : (
                <LoadingImg name={item.name} index={cIndex} />
              )}
              {/* To Display Heart */}
              {heart && !DH && (
                <motion.div
                  className="heart-cover"
                  initial={{ scale: heart ? 1.4 : 0 }}
                  animate={{
                    scale: heart ? (SM ? 2.3 : 2.8) : 0,
                  }}
                >
                  <FaHeart className="heart-icon" />
                </motion.div>
              )}
            </div>
          );
        })}

        {/* To Display Dots */}
        {images.length > 1 && (
          <div className="dots">
            {images.map((_, index) => {
              return (
                <Dot
                  key={index}
                  selected={selected == index}
                  onClick={onDotClick}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="top">
        <div
          onClick={() =>
            showSuggestions({ title: item?.name || item?.title, id })
          }
        >
          {/* <p>{imgLoaded ? "XX" : "###########"} </p> */}
          {item?.name && <div className="name">{item.name}</div>}
          {!item?.name && item.title && (
            <div className="title">{item?.title}</div>
          )}
          {!item?.name && !item?.title && (
            <div className="no-name">No Name </div>
          )}
        </div>
        <div className="icons">
          {images.length > 0 && showImgSizer && (
            <motion.div
              whileTap={{ scale: 1.3 }}
              onClick={() => setSmallScreen((prv) => !prv)}
            >
              {smallScreen ? (
                <RxEnterFullScreen className="icon small-screen" />
              ) : (
                <RxExitFullScreen className="icon small-screen" />
              )}
            </motion.div>
          )}
          <motion.div whileTap={{ scale: 1.3 }} className="likes-box">
            {likesCount != 0 && <p className="likes-count">{likesCount}</p>}

            {like ? (
              <FaHeart
                className="heart heart-fill"
                onClick={() => {
                  getAxios("data/unlike", { itemId: id, accId: profile._id });
                  setLike(false);
                  setLikesCount((prv) => prv - 1);
                  removeLike(id); // to change in data
                }}
              />
            ) : (
              <div
                ref={likeRef}
                onClick={() => {
                  getAxios("data/like", { itemId: id, accId: profile._id });
                  setLike(true);
                  setLikesCount((prv) => prv + 1);
                  addLike(id); // to change in data
                }}
              >
                <FaRegHeart className="heart heart-outline" />
              </div>
            )}
          </motion.div>
          <BsShareFill
            className="share-icon"
            onClick={() => onShare({ id, name: item?.name || item?.title })}
          />
          <motion.div whileTap={{ scale: 1.3 }}>
            {isSaved ? (
              <FaBookmark className="bookmark" onClick={removeBookMark} />
            ) : (
              <FaRegBookmark className="bookmark" onClick={addBookMark} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Dot({ selected, onClick, index }) {
  return (
    <div
      className={`dot ${selected ? "selected-dot" : ""}`}
      onClick={() => onClick(index)}
    ></div>
  );
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
