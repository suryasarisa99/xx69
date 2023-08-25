import React, { useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
export default function Verification() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER}/auth/verify/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) navigate("/x");
      });
  }, []);
  console.log(id);
  return (
    <div className="verification">
      verifying Your Mail
      <p>{id}</p>
    </div>
  );
}
