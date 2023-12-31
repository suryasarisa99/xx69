import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import { FaRegBookmark, FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { BsShareFill } from "react-icons/bs";
// import "./style.scss";
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
    currentUser,
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
    getAxios("data/save", { id: currentUser.uid, savedId: id });
    setSaved((prv) => [...prv, item]);
    setSavedIds((prv) => [...prv, id]);
  };
  const removeBookMark = (e) => {
    e.stopPropagation();
    getAxios("data/unsave", { id: currentUser.uid, savedId: id });
    setIsSaved(false);
    setSaved((prv) => prv.filter((s) => s._id != id));
    setSavedIds((prv) => prv.filter((sid) => sid != id));
  };
  const uploadToFireBase = async (imageSrc, resolution) => {
    const res = await fetch(imageSrc);
    const imageBlob = await res.blob();
    const timestamp = new Date().getTime();
    const fileName = `${item.name}_${resolution}.jpg`;
    let ImgRef = ref(storage, `xdps/${fileName}`);
    uploadBytes(ImgRef, imageBlob).then((res) => {
      console.log(res);
    });
  };

  const handleUpload = async (img) => {
    getAxios("data/red-quality", {
      img,
      name: item.name,
      imgId: id,
      pos: selected,
    }).then((res) => {
      console.log(res.data);
      const imageSrc1 = `data:${res.data.contentType};base64,${res.data.base64Datas[0]}`;
      const imageSrc2 = `data:${res.data.contentType};base64,${res.data.base64Datas[1]}`;
      uploadToFireBase(imageSrc1, "r_low");
      uploadToFireBase(imageSrc2, "r_md");
    });
  };
  return (
    <div>
      <div className="top">
        <div className="left-icons">
          <motion.div whileTap={{ scale: 1.3 }} className="likes-box">
            {likesCount != 0 && <p className="likes-count">{likesCount}</p>}

            {like ? (
              <FaHeart
                className="heart heart-fill"
                onClick={() => {
                  getAxios("data/unlike", {
                    itemId: id,
                    accId: currentUser.uid,
                  });
                  setLike(false);
                  setLikesCount((prv) => prv - 1);
                  removeLike(id); // to change in data
                }}
              />
            ) : (
              <div
                ref={likeRef}
                onClick={() => {
                  getAxios("data/like", { itemId: id, accId: currentUser.uid });
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
        </div>

        <div className="right-icons">
          {toggles.devMode && item.name && (
            <motion.p
              className="add-dp"
              whileTap={{ background: "gray" }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                handleUpload(item.images[selected]);
              }}
            >
              dp
            </motion.p>
          )}
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
