import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FaHeart } from "react-icons/fa";
import "../components/style.scss";
import _throttle from "lodash/throttle";
import { motion } from "framer-motion";
import LoadingImg from "./LoadingImg";
import storage from "../../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Resizer from "react-image-file-resizer";
export default function Carousel({
  p: { item, id, selected, setSelected, len, smallScreen },
  onSwipe,
  cIndex,
  handleBigHeart,
  imgLoaded,
  heart,
  SM,
}) {
  const { toggles, getAxios } = useContext(DataContext);

  const imgConRef = useRef(null);
  let [images, setImages] = useState(
    toggles.reverseOrder ? [...item.images].reverse() : item.images
  );
  useEffect(() => {
    imgConRef.current?.addEventListener("scroll", updateDotOnScroll);
    // imgConRef.current?.addEventListener("scroll", _throttle(test, 1));
  }, []);

  const updateDotOnScroll = () => {
    const imgBoxes = imgConRef.current.querySelectorAll(".img-box");
    for (let index = 0; index < imgBoxes.length; index++) {
      const imgBox = imgBoxes[index];
      let condition =
        imgBox.getBoundingClientRect().left -
        imgConRef.current.getBoundingClientRect().left;

      // console.log(`${index} : ${condition}`);
      const absValue = parseInt(Math.abs(condition));
      let thresold = parseInt(imgBoxes[0].offsetWidth / 2);
      if (absValue <= thresold && absValue >= -10) {
        console.log(`sel img: ${index}`);
        setSelected(index);
        break;
      }
    }
  };

  const onDotClick = (index) => {
    setSelected(index);
    // dotClickRef.current = true;
    const imgBox = imgConRef.current.querySelectorAll(".img-box")[index];
    imgConRef.current.scrollTo({
      left: imgBox.offsetLeft,
      behavior: "instant",
    });
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
              {/* {toggles.devMode && (
                <div className="temp">
                  <p>
                    h: {len[index].h} || w: {len[index].w} || r:{" "}
                    {len[index].h / len[index].w}
                  </p>
                </div>
              )} */}
              {imgLoaded[index] ? (
                <motion.img
                  key={index + id}
                  src={image}
                  alt={item?.name || item?.title || "x-img"}
                  onDoubleClick={handleBigHeart}
                  style={{
                    objectFit: smallScreen ? "contain" : "cover",
                    filter: toggles.blur ? "blur(18px)" : "none",
                  }}
                ></motion.img>
              ) : (
                <LoadingImg name={item.name} index={cIndex} />
              )}
              {/* To Display Heart */}
              {heart && (
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
