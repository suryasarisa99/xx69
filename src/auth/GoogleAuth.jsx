import { useEffect, useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function GoogleAuth() {
  // const [currentUser, setCurrentUser] = useState();
  const { currentUser, setCurrentUser } = useContext(DataContext);
  const navigate = useNavigate();
  const formOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      if (auth.currentUser) navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const SignOut = async () => {
    signOut(auth);
  };

  return (
    <div>
      <button onClick={formOnSubmit}>Google Signin</button>
      <button onClick={() => SignOut(auth)}>Signout</button>
      {currentUser ? (
        <div>
          <img src={currentUser.photoURL} alt="" />
          <div>Hello, {currentUser.displayName}</div>
          <div>Hello, {currentUser.email}</div>
          <div>Hello, {currentUser.uid}</div>
          <div>Hello, {auth?.currentUser?.displayName}</div>
        </div>
      ) : (
        <p>Not Logined</p>
      )}
    </div>
  );
}
