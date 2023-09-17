import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import _throttle from "lodash/throttle";
import { Link } from "react-router-dom";

export default function ProfileView({ data, setData, howToLoadData, type_ }) {
  const { setPostsData } = useContext(DataContext);
  const [loaded, setLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPostsData([...data]);
  }, [data]);

  useEffect(() => {
    LoadImages(data.slice(0, 12)).then((res) => setLoaded(12));
  }, []);

  useEffect(() => {
    window.onscroll = _throttle((e) => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        LoadImages(data.slice(loaded, loaded + 9))
          .then((res) => {
            console.log(res);
            setLoaded((prevLoaded) => prevLoaded + 9);
            // if (loaded >= data.length) {
            //   setIsLoading(false);
            // }
          })
          .catch((error) => {
            console.error("Error loading images:", error);
          });
      }
    }, 300);
  }, [data, loaded]);

  return (
    <div className="profile-view">
      {data?.slice(0, loaded)?.map((item, index) => (
        <Link key={index} to={`/post/${index}`}>
          <div className="img-box">
            <img src={item.images[0]} alt={`Image ${index}`} />
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
  const promises = data.map((item) => {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = item.images[0];
      image.onload = () => {
        resolve();
      };
      image.onerror = (err) => {
        reject(err);
      };
    });
  });

  return Promise.all(promises);
}
