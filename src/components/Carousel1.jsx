import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { BsShareFill, BsArrowsFullscreen } from "react-icons/bs";
import LoadingImg from "./LoadingImg";
import { motion } from "framer-motion";
import "./style.scss";
export default function Carousel({
  p: { item, id, selected, setSelected, len, smallScreen },
  onSwipe,
  cIndex,
  handleBigHeart,
  imgLoaded,
  heart,
  SM,
  type,
}) {
  let [pos, setPos] = useState(0);
  const { toggles } = useContext(DataContext);
  let limit = 50;

  let [images, setImages] = useState(
    toggles.reverseOrder ? [...item.images].reverse() : item.images
  );

  const start = useRef(null);
  const startY = useRef(null);

  // useEffect(() => {
  //   imgsRef.current.querySelectorAll("img").forEach((img) => {
  //     img.addEventListener("load", () => {
  //       setTemp(img.height);
  //       if (img.height > 700) {
  //         setLargeCarousel(true);
  //         img.style.height = "700px";
  //         img.style.objectFit = "cover";
  //         imgsRef.current.classList.add("large-carousel");
  //         img.classList.add("large-img");
  //       }
  //     });
  //   });
  // }, []);

  if (!images || images.length == 0) return null;
  const handleTS = (e) => {
    // console.log("start");
    start.current = e.targetTouches[0].clientX;
    startY.current = e.targetTouches[0].clientY;
  };
  const handleTM = (e) => {
    if (images.length == 1) return;
    const deltaX = e.targetTouches[0].clientX - start.current;
    const deltaY = e.targetTouches[0].clientY - startY.current;
    if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) return;
    // console.log("move");
    if (selected == 0 && deltaX > 0) return;
    else if (selected == images.length - 1 && deltaX < 0) return;
    setPos(deltaX);
  };
  const handleTE = () => {
    // console.log("end");
    if (Math.abs(pos) >= limit) {
      setSelected((prv) => {
        if (pos < limit && prv + 1 != images.length) return prv + 1;
        else if (pos > -1 * limit && prv - 1 != -1) return prv - 1;
        else return prv;
      });
    }
    setPos(0);
    start.current = 0;
  };

  let calc = `calc(${pos}px + -${selected}00%)`;

  return (
    <div
      className="carousel1 carousel"
      onTouchStart={onSwipe}
      onMouseOverCapture={onSwipe}
      // ref={imgsRef}
    >
      <div className="images-container">
        {images.map((image, index) => {
          return (
            <div key={index + id} className="img-box">
              {imgLoaded[index] ? (
                <motion.img
                  initial={{}}
                  animate={{}}
                  key={index + id}
                  src={image}
                  alt={item.name || item.title || "x"}
                  style={{
                    transform: toggles.slide
                      ? `translateX(${pos != 0 ? calc : -1 * selected + "00%"})`
                      : `translateX(-${selected}00%)`,
                    objectFit: smallScreen ? "contain" : "cover",
                  }}
                  onTouchStart={handleTS}
                  onTouchMove={handleTM}
                  onTouchEnd={handleTE}
                  onDoubleClick={handleBigHeart}
                />
              ) : (
                <LoadingImg name={item.name} index={cIndex} />
              )}
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
        {images.length > 1 && (
          <div className="dots">
            {images.map((_, index) => {
              return (
                <Dot
                  key={index}
                  selected={selected == index}
                  onClick={() => setSelected(index)}
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
