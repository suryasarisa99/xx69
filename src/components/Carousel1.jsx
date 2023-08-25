import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BsShareFill, BsArrowsFullscreen } from "react-icons/bs";
import { motion } from "framer-motion";
import "./style.scss";
export default function Carousel({
  images: imagesX,
  name,
  onSwipe,
  onShare,
  id,
  type,
  removeCarouselFromSaved,
}) {
  let [pos, setPos] = useState(0);
  const navigate = useNavigate();
  const { slide, lastImg, reverseOrder, saved, setSaved, scrollPos, dispatch } =
    useContext(DataContext);
  let [isSaved, setIsSaved] = useState(saved.includes(id));
  let [temp, setTemp] = useState(0);
  let [largeCarousel, setLargeCarousel] = useState(false);
  let limit = 50;

  let [images, setImages] = useState(
    reverseOrder ? [...imagesX].reverse() : imagesX
  );

  let [selected, setSelected] = useState(lastImg ? images.length - 1 : 0);

  const start = useRef(null);
  const startY = useRef(null);
  const imgsRef = useRef(null);

  useEffect(() => {
    imgsRef.current.querySelectorAll("img").forEach((img) => {
      img.addEventListener("load", () => {
        setTemp(img.height);
        if (img.height > 700) {
          setLargeCarousel(true);
          img.style.height = "700px";
          img.style.objectFit = "cover";
          imgsRef.current.classList.add("large-carousel");
          img.classList.add("large-img");
        }
      });
    });
  }, []);
  // useEffect(() => {
  //   const handleImageLoad = (img) => {
  //     setTemp(img.height);
  //     if (img.height > 750) {
  //       setLargeCarousel(true);
  //       imgsRef.current.classList.add("large-carousel");
  //       img.classList.add("large-img");
  //     }
  //   };

  //   const imgLoadListeners = [];

  //   imgsRef.current.querySelectorAll("img").forEach((img) => {
  //     const loadListener = () => handleImageLoad(img);
  //     img.addEventListener("load", loadListener);
  //     imgLoadListeners.push({ img, loadListener });
  //   });

  //   return () => {
  //     imgLoadListeners.forEach(({ img, loadListener }) => {
  //       loadListener();
  //       img.removeEventListener("load", loadListener);
  //     });
  //   };
  // }, []);
  // function handleImgLoad() {}

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
  const onDotClick = (index) => {
    setSelected(index);
  };
  const addBookMark = () => {
    setIsSaved(true);
    setSaved((prv) => [...prv, id]);
  };
  const removeBookMark = () => {
    setIsSaved(false);
    saved.splice(saved.indexOf(id), 1);
    setSaved([...saved]);
    if (type == "saved") removeCarouselFromSaved(id);
  };
  let calc = `calc(${pos}px + -${selected}00%)`;

  return (
    <div
      className="carousel1 carousel"
      onTouchStart={onSwipe}
      onMouseOverCapture={onSwipe}
      ref={imgsRef}
    >
      <div className="images-container">
        {images.map((image, index) => {
          return (
            // <div key={index + id} className="img-box">
            <img
              key={index + id}
              src={image}
              alt="man"
              style={{
                transform: slide
                  ? `translateX(${pos != 0 ? calc : -1 * selected + "00%"})`
                  : `translateX(-${selected}00%)`,
              }}
              onTouchStart={handleTS}
              onTouchMove={handleTM}
              onTouchEnd={handleTE}
              loading="lazy"
            />
            //</div>
          );
        })}
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
        <div className="name">{name}</div>
        <div className="icons">
          {largeCarousel && (
            <BsArrowsFullscreen
              className="full-screen-icon"
              onClick={() => {
                dispatch({ type: "home", payload: window.scrollY });
                navigate("/large/" + id);
              }}
            />
          )}
          <BsShareFill
            className="share-icon"
            onClick={() => onShare({ id, name })}
          />
          <motion.div initial={{ scale: 1 }} whileTap={{ scale: 1.5 }}>
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
