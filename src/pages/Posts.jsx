import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for navigation
import { DataContext } from "../context/DataContext";
export default function PostPage() {
  const { index } = useParams();
  const currentIndex = parseInt(index);
  const { postsData } = useContext(DataContext);

  const [scrollPosition, setScrollPosition] = useState(currentIndex * -100); // Initialize scroll position based on the selected image index

  useEffect(() => {
    // console.log(postsData);
    document.getElementById(postsData[index]._id).scrollIntoView();
  }, []);

  useEffect(() => {
    setScrollPosition(currentIndex * -100);
  }, [currentIndex]);

  return (
    <div className="post-page">
      <div className="posts">
        <div
          className="posts-content"
          //   style={{ transform: `translateX(${scrollPosition}%)` }}
        >
          {postsData.map((item, i) => (
            <div key={i} className="post-image" id={item._id}>
              <img src={item.images[0]} alt={`Image ${i}`} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          // Handle previous button click to scroll left
          setScrollPosition((prevPosition) => prevPosition + 100);
        }}
      >
        Previous
      </button>
      <button
        onClick={() => {
          // Handle next button click to scroll right
          setScrollPosition((prevPosition) => prevPosition - 100);
        }}
      >
        Next
      </button>
    </div>
  );
}
