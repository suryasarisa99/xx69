import { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
export default function Unlock() {
  const { handleTempPass, login, wrongPass, setWrongPass } =
    useContext(DataContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (login) navigate("/");
  }, [login]);
  return (
    <div>
      <form className="unlock" onSubmit={handleTempPass}>
        <p>Enter Password</p>
        <input type="password" name="pass" />
        <button>Submit</button>
      </form>
      {wrongPass && (
        <div className="error">
          Incorrect Password, Password Will Change for Every Few Seconds
        </div>
      )}
    </div>
  );
}
