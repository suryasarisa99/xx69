import { useContext, useEffect } from "react";
import { DataContext } from "../src/context/DataContext";

export default function useProfileImg(state, name, type = "normal") {
  const { actress, profileImgs } = useContext(DataContext);

  useEffect(() => {
    if (type == "normal" || actress.length == 0) return;
    let actor = actress.find((item) => item._id == name);
    if (actor) state(actor.img);
  }, [actress, name, type, state]);

  useEffect(() => {
    if (type == "org" || profileImgs.length == 0) return;
    let actor = profileImgs.find((item) => item.name == name);
    if (actor) state(actor.url);
  }, [profileImgs, name, type, state]);
}
