import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { auth } from "../../firebaseConfig";
import "./about.scss";
export default function About() {
  let { currentUser } = useContext(DataContext);
  return (
    <div className="my-about">
      {currentUser && (
        <div className="about-card">
          <img src={currentUser.photoURL} alt="" />
          <div>
            <p className="name">{currentUser.displayName}</p>
            <p className="email">{currentUser.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
