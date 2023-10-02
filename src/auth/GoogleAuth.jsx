import React, { useEffect } from "react";
import { auth, googleProvider } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export default function GoogleAuth() {
  const [currentUser, setCurrentUser] = React.useState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log(user);
    });
  }, [auth]);

  const formOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
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
      {currentUser && (
        <div>
          <img src={currentUser.photoURL} alt="" />
          <div>Hello, {currentUser.displayName}!</div>
        </div>
      )}
    </div>
  );
}
