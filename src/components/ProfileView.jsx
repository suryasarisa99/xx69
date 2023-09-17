import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "../context/DataContext";
import _throttle from "lodash/throttle";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";
export default function ProfileView({
  name,
  // data: postsData[name][data_type],
  setData,
  howToLoadData,
  type_,
  data_type,
}) {
  const { setPostsData, carouselsLoaded, dispatchLoaded, postsData } =
    useContext(DataContext);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(carouselsLoaded.profile?.[name] || 0);
  const [isLoading, setIsLoading] = useState(true);
  // const [alreadyLoading, setAlreadyLoading] = useState(true);
  const alreadyLoading = useRef(true);
  const [longPress, setLongPress] = useState(false);
  const [bigImg, setBigImg] = useState();
  const dblClick = useRef(null);

  useEffect(() => {
    if (loaded == 0) {
      LoadImages(postsData?.[name]?.[data_type]?.slice(0, 12)).then((res) => {
        setTimeout(() => (alreadyLoading.current = false), 400);
        setLoaded(12);
      });
    } else setTimeout(() => (alreadyLoading.current = false), 400);
  }, [postsData]);

  function showOverlay() {
    document.getElementById("overlay").classList.remove("hidden");
    let root = document.getElementById("root");
    root.style.filter = "blur(15px)";
    // root.style.maxHeight = "100vh";
    // root.style.overflow = "hidden";
  }
  function closeOverlay() {
    setLongPress(false);

    document.getElementById("overlay").classList.add("hidden");
    let root = document.getElementById("root");
    root.style = "";
    // root.style.maxHeight = "initial";
    // root.style.overflow = "initial";
  }

  useEffect(() => {
    const closeOverlayOnEscap = (e) => {
      console.log(e);
      if (e.key == "Escape") closeOverlay();
    };
    document.addEventListener("keydown", closeOverlayOnEscap);

    return () => {
      document.removeEventListener("keydown", closeOverlayOnEscap);
      closeOverlay();
    };
  }, []);

  useEffect(() => {
    window.onscroll = _throttle((e) => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight &&
        !alreadyLoading.current
      ) {
        alreadyLoading.current = true;
        LoadImages(postsData?.[name]?.[data_type].slice(loaded, loaded + 12))
          .then((res) => {
            alreadyLoading.current = false;
            setLoaded((prevLoaded) => prevLoaded + 12);
            dispatchLoaded({ type: "profile", payload: { [name]: loaded } });
            if (loaded >= postsData?.[name]?.[data_type].length) {
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error loading images:", error);
          });
      }
    }, 10);
  }, [postsData, loaded]);
  const timerRef = useRef(null);

  return (
    <div className="profile-view">
      {postsData?.[name]?.[data_type]?.slice(0, loaded)?.map((item, index) => (
        <div
          key={item._id}
          onClick={(e) => {
            setTimeout(() => {
              if (!dblClick.current) {
                navigate(`/profile/${name}/${data_type}/${index}`);
              }
            }, 200);
          }}
          onDoubleClick={(e) => {
            dblClick.current = true;
            setTimeout(() => (dblClick.current = false), 300);
            setLongPress(true);
            showOverlay();
            setBigImg(item);
          }}
        >
          <div className={"img-box " + data_type}>
            <img
              src={item.images[0]}
              key={"img-" + item._id}
              alt={`Image ${index}`}
            />
          </div>
        </div>
      ))}
      {longPress &&
        createPortal(
          <div>
            <div className="simple-carousel">
              {bigImg.images.map((img) => {
                return (
                  <div className="img-box" key={img}>
                    <img src={img} />
                  </div>
                );
              })}
            </div>

            <div className="cross-btn" onClick={closeOverlay}>
              <AiFillCloseCircle className="cross-icon" />
            </div>
          </div>,
          document.getElementById("overlay")
        )}

      {isLoading && (
        <div className="loader">
          <span className="loading-spinner"></span>
        </div>
      )}
    </div>
  );
}

function LoadImages(data) {
  console.log("loading");
  const promises = data?.map((item) => {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = item.images[0];
      image.onload = () => {
        resolve();
      };
      image.onerror = (err) => {
        resolve(err);
      };
    });
  });
  console.log("done");
  return Promise.all(promises);
}
