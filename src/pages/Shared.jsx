import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import Carousel1 from "../components/Carousel1";
import Carousel2 from "../components/Carousel2";

export default function Shared() {
  const { data, isCarousel2 } = useContext(DataContext);
  const { id } = useParams();
  let [item, setItem] = useState(null);
  useEffect(() => {
    setItem(data.filter((item) => item._id == id)[0]);
  }, [data, id]);
  // console.log(data.flatMap((d) => d.data));
  return (
    <div>
      {item &&
        (isCarousel2 ? (
          <Carousel2 {...item} images={item.images} />
        ) : (
          <Carousel1 {...item} />
        ))}
    </div>
  );
}
