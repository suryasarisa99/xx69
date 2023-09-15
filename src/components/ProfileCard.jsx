import { useNavigate } from "react-router-dom";

export default function ProfileCard({ name, id, img, forceClose }) {
  const navigate = useNavigate();
  function openProfile() {
    forceClose();
    navigate("/profile/" + name);
    console.log("open -- profile");
  }
  function Search() {
    navigate(`/search/${"home"}/${name}`);
    forceClose();
  }
  function googleSearch() {
    open(`https://www.google.com/search?q=${name}`);
    forceClose();
  }
  return (
    <div className="profile-card">
      <div className="name">{name}</div>
      <div className="flex">
        <div className="img-box">
          <img src={img} alt="" />
        </div>
        <div className="links">
          <button onClick={openProfile}>View Profile</button>
          <button onClick={Search}>Search</button>
          <button onClick={googleSearch}>Google Search</button>
        </div>
      </div>
    </div>
  );
}
