import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import SearchBar2 from "../components/SearchBar2";
import Fuse from "fuse.js";
import storage from "../../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import actressX from "../../actress.json";
export default function Profiles() {
  const { profiles, getAxios, setProfiles, fetching } = useContext(DataContext);
  const [query, setQuery] = useState("");
  // const [profiles, setProfiles] = useState([]);
  const pFuse = new Fuse(profiles, { threshold: 0.4, keys: ["name"] });
  let actress = useRef(null);
  let totalVerCarousels = useRef(0);
  console.log(profiles);
  useEffect(() => {
    if (profiles.length == 0 && fetching.current.profiles == 0) {
      fetching.current.profiles = 1;
      console.log("fetching profiles - from Profiles");
      getAxios("data/profiles").then((res) => {
        fetching.current.profiles = 2;
        setProfiles(res.data);
      });
    }
  }, [fetching]);

  function queryOnChange(q) {
    setQuery(q);

    scrollTo({ top: 0 });
  }

  return (
    <div className="profiles">
      <SearchBar2 query={query} onChange={queryOnChange} />
      <div className="flex-items">
        <p className="profile-item">
          Total Posts: <span>39,3465</span>
        </p>
        <p className="profile-item">
          Total Pics: <span>98,854</span>{" "}
        </p>
      </div>
      {(query ? pFuse.search(query).map((item) => item.item) : profiles).map(
        (profile) => {
          return <ProfileItem2 profile={profile} key={profile.name} />;
        }
      )}
    </div>
  );
}

function ProfileItem({ profile }) {
  const navigate = useNavigate();
  return (
    <div
      className="profile-item"
      onClick={() => navigate("/profile/" + profile.name)}
    >
      <p className="name">{profile.name}</p>
      <p className="count">{profile.count}</p>
    </div>
  );
}
function ProfileItem2({ profile }) {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState();
  const { profiles, getAxios, setProfiles, fetching } = useContext(DataContext);

  function getImg(imgName) {
    let ImgRef = ref(storage, `dps/${imgName}`);
    getDownloadURL(ImgRef).then((url) => {
      setImgUrl(url);
      console.log(url);
    });
  }

  useEffect(() => {
    if (profile.images) {
      getImg(profile.name + "_r160.jpg");
    }
  }, [profiles]);
  return (
    <div
      className="profile-item2"
      onClick={() => navigate("/profile/" + profile.name)}
    >
      {/* <img src="https://i.ibb.co/gPJ2djN/peakpx-10.jpg" alt="" /> */}
      <div className="img-box">
        <img src={imgUrl} alt={""} />
      </div>
      <div className="about">
        <p className="name">{profile.name}</p>
        <p className="count">
          Posts:
          <span className="count-value">{profile.count}</span>
        </p>
      </div>
    </div>
  );
}
