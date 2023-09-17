import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "../context/DataContext";
import _throttle from "lodash/throttle";
import { Link } from "react-router-dom";

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
  const [loaded, setLoaded] = useState(carouselsLoaded.profile?.[name] || 0);
  const [isLoading, setIsLoading] = useState(true);
  // const [alreadyLoading, setAlreadyLoading] = useState(true);
  const alreadyLoading = useRef(true);

  useEffect(() => {
    if (loaded == 0) {
      LoadImages(postsData?.[name]?.[data_type]?.slice(0, 12)).then((res) => {
        setTimeout(() => (alreadyLoading.current = false), 400);
        setLoaded(12);
      });
    } else setTimeout(() => (alreadyLoading.current = false), 400);
  }, [postsData]);

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

  return (
    <div className="profile-view">
      {postsData?.[name]?.[data_type]?.slice(0, loaded)?.map((item, index) => (
        <Link key={item._id} to={`/profile/${name}/${data_type}/${index}`}>
          <div className={"img-box " + data_type}>
            <img
              src={item.images[0]}
              key={"img-" + item._id}
              alt={`Image ${index}`}
            />
          </div>
        </Link>
      ))}

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
