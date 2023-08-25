import { useState, useEffect, useRef, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BsShareFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import "./style.scss";
export default function Carousel() {
  // {
  //   images: imagesX,
  //   name,
  //   onSwipe,
  //   onShare,
  //   id,
  //   type,
  //   removeCarouselFromSaved,
  // }
  const { id } = useParams();
  const { slide, lastImg, reverseOrder, saved, setSaved, data } =
    useContext(DataContext);
  let [isSaved, setIsSaved] = useState(saved.includes(id));
  let limit = 50;
  const item = data.filter((item) => item.id == id)[0];
  let [images, setImages] = useState(
    reverseOrder ? [...item.images].reverse() : item.images
  );

  let [selected, setSelected] = useState(lastImg ? images.length - 1 : 0);

  if (!images || images.length == 0) return null;

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
    // if (type == "saved") removeCarouselFromSaved(id);
  };
  //   let calc = `calc(${pos}px + -${selected}00%)`;

  return (
    <div className="carousel2" onTouchStart={() => {}}>
      <div className="sep"></div>
      <div className="images-container">
        {images.map((image, index) => {
          return (
            <div key={index + id} className="img-box">
              <img key={index + id} src={image} alt="man" loading="lazy" />
            </div>
          );
        })}
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
