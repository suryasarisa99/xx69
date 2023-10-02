import axios from "axios";
import { useEffect, useState, useRef, useContext, useReducer } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate, Link } from "react-router-dom";

const reducer = (errors, action) => {
  // errors[action.type] = action.value;
  return { ...errors, [action.type]: action.value };
};

export default function Signup() {
  let { userData } = useContext(DataContext);
  let [errors, dispatch] = useReducer(reducer, {
    fnameReq: false,
    usernameReq: false,
    userInvalid: false,
    passLen: false,
    emailReq: false,
    emailInvalid: false,
  });
  const isError = useRef(false);
  const navigate = useNavigate();
  let [pass, setPass] = useState("");
  let [fname, setFname] = useState("");
  let [email, setEmail] = useState("");
  let [userName, setUserName] = useState("");
  const e = useRef(null);
  const isMounted = useRef(true);
  function wait() {
    console.log("<===== useeffect ======>");
    isError.current = false;
    for (let error in errors) {
      console.log(`${error}: ${errors[error]}`);
      if (errors[error] === true) {
        console.log(`> ${error}: ${errors[error]}`);
        isError.current = true;
        break;
      }
    }
    console.log("<======================>");

    if (!isError.current) {
      console.log("running axios function");
      axiosSignup();
    }
  }
  useEffect(() => {
    if (!isMounted.current) {
      wait();
    } else isMounted.current = false;
  }, [errors, e.current]);

  const handleSignUp = (event) => {
    event.preventDefault();
    if (fname.trim().length < 1) dispatch({ type: "fnameReq", value: true });
    if (userName.trim().length < 1)
      dispatch({ type: "usernameReq", value: true });
    if (email.trim().length < 1) dispatch({ type: "emailReq", value: true });
    if (!email.includes("@")) dispatch({ type: "emailInvalid", value: true });
    if (pass.trim().length < 3) dispatch({ type: "passLen", value: true });
    e.current = event;
    // setTimeout(wait, 5000);
  };

  function axiosSignup() {
    axios
      .post(`${import.meta.env.VITE_SERVER}/auth/signup`, {
        // fname: e.target.fname.value,
        sname: e.current.target.sname.value,
        password: pass,
        username: userName,
        fname,
        // sname,
        email,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data?.username) {
          console.log("user found");
          dispatch({ type: "userInvalid", value: true });
        } else if (res.data?.email) {
          dispatch({ type: "emailInvalid", value: true });
        } else if (res.data?.status) {
          console.log("user signuped");
          localStorage.setItem("token", res.data.token);
          navigate("/verify");
        }
      });
  }
  return (
    <form className="signup" onSubmit={handleSignUp}>
      <h1 className="signup">Create Account</h1>
      <div className="field">
        <input
          name="fname"
          placeholder="First Name"
          value={fname}
          onChange={(e) => {
            setFname(e.target.value);
            if (errors.fnameReq && e.target.value.length >= 1)
              dispatch({ type: "fnameReq", value: false });
          }}
        />
        {errors.fnameReq && <Error>First Name Can`&apos;`t be Empty</Error>}
      </div>

      <input name="sname" placeholder="Last Name" />

      <div className="field">
        <input
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.emailReq && e.target.value.length >= 1)
              dispatch({ type: "emailReq", value: false });
            if (errors.emailInvalid && e.target.value.includes("@"))
              dispatch({ type: "emailInvalid", value: false });
          }}
        />
        {errors.emailReq && <Error>Email Name can`&apos;`t be Empty</Error>}
        {errors.emailInvalid && <Error>The Email is Invalid</Error>}
      </div>

      <div className="field">
        <input
          name="id"
          placeholder="username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            if (errors.usernameReq && e.target.value.length >= 1)
              dispatch({ type: "usernameReq", value: false });
            if (errors.userInvalid)
              dispatch({ type: "userInvalid", value: false });
          }}
        />
        {errors.usernameReq && <Error>User Name can`&apos;`t be Empty</Error>}
        {errors.userInvalid && <Error>The User Name is Already Taken</Error>}
      </div>

      <div className="field">
        <input
          name="password"
          placeholder="password"
          value={pass}
          onChange={(e) => {
            if (errors.passLen && e.target.value.length >= 3)
              dispatch({ type: "passLen", value: false });
            setPass(e.target.value);
          }}
        />
        {errors.passLen && <Error>Password is Minium 3 characters</Error>}
      </div>

      <button>Signup</button>
      <center>
        <p className="sm-txt">
          Already have a account? <Link to="/signin">signin</Link>
        </p>
      </center>
    </form>
  );
}

function Error({ children }) {
  return <div className="error">{children}</div>;
}
