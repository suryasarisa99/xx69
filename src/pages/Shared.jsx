import { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom";
import Carousel1 from "../post/Carousel1";
import Carousel2 from "../post/Carousel2";

export default function Shared() {
  const { isCarousel2, getAxios } = useContext(DataContext);
  const { id } = useParams();
  let [item, setItem] = useState(null);
  useEffect(() => {
    getAxios("data/find/" + id).then((res) => setItem(res.data));
  }, [id]);

  console.log(item);
  return (
    <div>
      {item &&
        (isCarousel2 ? (
          <Carousel2 index={"x"} item={item} />
        ) : (
          <Carousel1 {...item} />
        ))}
    </div>
  );
}
