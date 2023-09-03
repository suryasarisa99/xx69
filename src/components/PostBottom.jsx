import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { BsShareFill } from "react-icons/bs";
import "./style.scss";
import _throttle from "lodash/throttle";
import { motion, AnimatePresence } from "framer-motion";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseConfig.js";

export default function PostBottom({
  p: { item, id, selected, setSelected, len, smallScreen },
  onShare,
  addLike,
  removeLike,
  setSmallScreen,
  showSuggestions,
  likeRef,
}) {
  const {
    profile,
    profiles,
    setSaved,
    getAxios,
    savedIds,
    setSavedIds,
    toggles,
    setProfiles,
  } = useContext(DataContext);
  let [like, setLike] = useState(item.likeStatus);
  let [likesCount, setLikesCount] = useState(item.likes);

  let [isSaved, setIsSaved] = useState(savedIds.includes(item._id));
  const addBookMark = (e) => {
    e.stopPropagation();
    setIsSaved(true);
    getAxios("data/save", { id: profile._id, savedId: id });
    setSaved((prv) => [...prv, item]);
    setSavedIds((prv) => [...prv, id]);
  };
  const removeBookMark = (e) => {
    e.stopPropagation();
    getAxios("data/unsave", { id: profile._id, savedId: id });
    setIsSaved(false);
    setSaved((prv) => prv.filter((s) => s._id != id));
    setSavedIds((prv) => prv.filter((sid) => sid != id));
  };
  const uploadToFireBase = async (imageSrc) => {
    const res = await fetch(imageSrc);
    const imageBlob = await res.blob();
    const timestamp = new Date().getTime();
    const fileName = `${item.name}_r160.jpg`;
    let ImgRef = ref(storage, `dps/${fileName}`);
    uploadBytes(ImgRef, imageBlob).then((res) => {
      console.log(res);
    });
  };

  const handleUpload = async (img) => {
    getAxios("data/red-quality", { img, name: item.name }).then((res) => {
      console.log(res.data);
      const imageSrc = `data:${res.data.contentType};base64,${res.data.base64Data}`;
      uploadToFireBase(imageSrc);
    });
  };
  return (
    <div>
      <div className="top">
        <div
          onClick={() =>
            showSuggestions({ title: item?.name || item?.title, id })
          }
        >
          {item?.name && <div className="name">{item.name}</div>}
          {!item?.name && item.title && (
            <div className="title">{item?.title}</div>
          )}
          {!item?.name && !item?.title && (
            <div className="no-name">No Name </div>
          )}
        </div>
        <div className="icons">
          {toggles.devMode && item.name && (
            <p
              onClick={() => {
                handleUpload(item.images[selected]);
                // let p = profiles.find((item) => item.name == item.name);
                // p.images = item.name;
                // setProfiles((prv) => [...prv]);
              }}
            >
              dp
            </p>
          )}
          <AnimatePresence>
            {item.images.length > 0 && len[selected].show && (
              <motion.div
                initial={{ scale: 0.4 }}
                whileInView={{ scale: 1.2 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
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
          </AnimatePresence>
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
