import { useState, useContext, useEffect, useRef } from "react";
import { DataContext } from "../context/DataContext";
import axios from "axios";
export default function Admin() {
  const [pass, setPass] = useState("...");
  const [pos, setPos] = useState(0);
  const [error, setError] = useState(false);
  const time = useRef(null);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/time`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setPos(res.data.pos);
        time.current = res.data.time;
      });
    const countTime = () => {
      const intervalId = setInterval(() => {
        setPos((prevPos) => (prevPos + 1) % (time.current + 1)); // Increment and reset pos if it reaches time + 1
      }, 1000);

      return intervalId;
    };

    const intervalId = countTime();

    // Cleanup function to clear the interval timer
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleChangePass = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/change-pass`,
        {
          pass: e.target.pass.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data?.status == false) setError(true);
        console.log(res.data);
      });
  };
  const handleGetpass = (e) => {
    e.preventDefault();
    axios
      .get(`${import.meta.env.VITE_SERVER}/get-pass`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data?.status == false) setError(true);
        setPass(res.data.pass);
      });
  };
  const handleChangeTime = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/pass-timeout`,
        { time: +e.target.time.value },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.status == false) setError(true);
        time.current = res.data.time;
      });
  };

  const handleLoginTimeOut = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/login-timeout`,
        { time: +e.target.time.value },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data?.status == false) setError(true);
      });
  };

  return (
    <div className="admin">
      {/* <form onSubmit={handleChangePass}>
        <input type="text" placeholder="create password" name="pass" />
        <button>Submit</button>
      </form> */}
      <div className="progress-bar">
        <progress max={time.current} value={pos} />
      </div>
      <form onSubmit={handleGetpass}>
        {/* <input type="text" placeholder="Get password" /> */}
        <button>Get Password-{time.current}</button>
        <div className="label">{pass}</div>
      </form>

      <form className="mini-form" onSubmit={handleChangeTime}>
        <input type="text" placeholder="password timeout" name="time" />
        <button>Submit</button>
      </form>
      <form className="mini-form" onSubmit={handleLoginTimeOut}>
        <input type="text" placeholder="login timeout" name="time" />
        <button>Submit</button>
      </form>

      {error && <div className="error">You Are Not Admin Of This Site</div>}
    </div>
  );
}
