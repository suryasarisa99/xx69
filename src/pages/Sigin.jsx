import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import "./siginstyles.scss";
export default function Sigin() {
  let navigate = useNavigate();
  let { setUserData, userData, setSignin, setOtherUsers, otherUsers } =
    useContext(DataContext);
  // useEffect(() => {
  //   if (userData) {
  //     console.log("user Data found");
  //     navigate("/main");
  //   } else console.log("No user Data");
  // }, [userData]);

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_SERVER}/auth/signin`, {
        username: e.target.id.value,
        password: e.target.password.value,
      })
      .then((res) => {
        console.log(res.data);
        if (!res.data.status) {
          //
        } else {
          localStorage.setItem("token", res.data.token);
          setSignin(true);
          navigate("/x");
        }
      });
  };
  return (
    <div>
      <form className="signin" onSubmit={handleSignIn}>
        <h1 className="signin">Sigin</h1>
        <input name="id" placeholder="User Name" />
        <input name="password" type="password" placeholder="password" />
        <button>SignIn</button>
      </form>
      <center>
        <p className="sm-txt">
          Create Account ? <Link to="/signup">signup</Link>
        </p>
      </center>
    </div>
  );
}
