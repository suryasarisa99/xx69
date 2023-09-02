import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export default function Unlock() {
  const { handlePass } = useContext(DataContext);
  return (
    <form className="unlock" onSubmit={handlePass}>
      <p>Enter Password</p>
      <input type="password" name="pass" />
      <button>Submit</button>
    </form>
  );
}
