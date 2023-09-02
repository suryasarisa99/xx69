import { useEffect, useContext, useState, useRef } from "react";
import Carousel from "./Carousel-new2";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";
// import data from "../../data.json";
// Images
import sradhakapoor from "../../images/sradha-kapoor2.jpg";
import sradhakapoorx from "../../images/sradha-kapoor2x.jpg";
import sradha from "../../images/sradha.jpeg";
import sradhax from "../../images/sradhax.jpeg";
import jahanavi from "../../images/jahanavi.jpeg";
import jahanavix from "../../images/jahanavix.jpeg";
import sneha from "../../images/sneha.jpeg";
import snehax from "../../images/snehax.jpeg";
import keerthika from "../../images/keerthika.jpeg";
import keerthika2 from "../../images/keerthika2.jpeg";
import keerthikax from "../../images/keerthikax.jpeg";
import keerthikaxx from "../../images/keerthikaxx.jpeg";
import keerthika2x from "../../images/keerthika2x.jpeg";
import keerthika2xx from "../../images/keerthika2xx.jpeg";
import hari from "../../images/hari.jpeg";
import harix from "../../images/harix.jpeg";
import nidhi from "../../images/nidhi.jpeg";
import nidhix from "../../images/nidhix.jpeg";
import nayanthara from "../../images/nayanthara.jpeg";
import nayantharax from "../../images/nayantharax.jpeg";
import nadeesha from "../../images/nadeesha.jpeg";
import nadeeshax from "../../images/nadeeshax.jpeg";
import ananyapandey from "../../images/ananya-pandey.jpg";
import ananyapandeyx from "../../images/ananya-pandeyx.jpg";

export default function AiRemover() {
  const navigate = useNavigate();
  const { login, tempLogin, setTempLogin, timeOut } = useContext(DataContext);
  const [time, setTime] = useState(0);
  let data = useLocation().state?.data;
  const [noName, setNoName] = useState(false);
  const [query, setQuery] = useState("");
  const pos = useRef(null);
  useEffect(() => {
    pos.current = 0;
    setTime(0);
    let i = 0;
    let x = setInterval(() => {
      i++;
      setTime(i);
      if (i == timeOut + 1) {
        clearInterval(x);
        setTempLogin(false);
      }
    }, 1000);
    window.addEventListener("keydown", (e) => {
      if (e.key === "PrintScreen") {
        alert("Screenshots are not allowed.");
        e.preventDefault();
      }
    });

    window.addEventListener("scroll", (e) => {
      console.log("======= Scroll =======");
      console.log(e);
    });

    // setTimeout(() => {
    //   setTempLogin(false);
    // }, 60000);
    document.addEventListener("blur", () => {
      console.log("========focus======f");
      setTempLogin(false);
    });
    document.addEventListener("focus", () => {
      console.log("========focus======f");
      setTempLogin(false);
    });
  }, []);
  useEffect(() => {
    console.log(login);
    console.log(tempLogin);
    if (!login && !tempLogin) navigate("/login");
  }, [login, tempLogin]);

  return (
    <div>
      {/* <div className="progress-bar">
        <progress max={timeOut} value={time} />
      </div> */}
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(e.target.query.value);
        }}
      >
        <input type="text" placeholder="search" name="query" />
      </form>
      <button onClick={() => setNoName((prv) => !prv)}>No Name {noName}</button>
      {/* <input
        type="text"
        placeholder="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      /> */}
      {/* <Carousel images={[sradha, sradhax]} name="Shraddha Kapoor" />
      <Carousel images={[sradhakapoor, sradhakapoorx]} name="Shraddha Kapoor" />
      <Carousel images={[jahanavi, jahanavix]} name="Janhvi Kapoor" />
      <Carousel images={[sneha, snehax]} name="Sneha" />
      <Carousel
        images={[keerthika, keerthikax, keerthikaxx]}
        name="Ketika Sharma"
      />
      <Carousel
        images={[keerthika2, keerthika2x, keerthika2xx]}
        name="Ketika Sharma"
      />
      <Carousel images={[hari, harix]} name="Hari Prasadh" />
      <Carousel images={[nidhi, nidhix]} name="Nidhi Agarwal" />
      <Carousel images={[nayanthara, nayantharax]} name="Nayanthara" />
      <Carousel images={[nadeesha, nadeeshax]} name="Nadeesha Hemamali" />
      <Carousel
        images={[ananyapandey, ananyapandeyx]}
        name="Nadeesha Hemamali"
      /> */}
      {noName
        ? data.map((item, index) => {
            if (!item?.title?.trim())
              return (
                <div key={index}>
                  <Carousel
                    images={item.images}
                    name={item.title?.replace("-", " ").replace("?", "")}
                  />
                </div>
              );
          })
        : data.map((item, index) => {
            if (
              item?.title
                ?.replace("-", " ")
                ?.replace("?", "")
                ?.toLowerCase()
                ?.includes(query.toLowerCase())
            )
              return (
                <div key={index}>
                  <Carousel
                    images={item.images}
                    name={item.title?.replace("-", " ").replace("?", "")}
                  />
                </div>
              );
          })}
    </div>
  );
}
