import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import { AiOutlineCloseCircle } from "react-icons/ai";

const ShareButtons = ({ id, title = "Image", onClose, forceClose }) => {
  //   let url = `http://192.168.0.169:4444/shared/${id}`;
  let url = `https://x69.vercel.app/shared/${id}`;

  return (
    <div className="share">
      <div className="head">
        <h2>Share this: Image</h2>
        <AiOutlineCloseCircle
          className="icon"
          onClick={(e) => {
            e.preventDefault();
            forceClose(e);
          }}
        />
      </div>
      <div className="items">
        <div>
          <FacebookShareButton url={`http:`} quote={title}>
            Facebook
          </FacebookShareButton>
        </div>
        <div>
          <TwitterShareButton url={url} title={title}>
            Twitter
          </TwitterShareButton>
        </div>
        <div>
          <WhatsappShareButton url={url} title={title}>
            WhatsApp
          </WhatsappShareButton>
        </div>
        <div>
          <InstagramShareButton url={url} />
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;

const InstagramShareButton = ({ url }) => {
  const handleClick = () => {
    // Open Instagram app with a pre-filled caption
    window.open(
      `instagram://share?text=${encodeURIComponent(
        "Check out this content: " + url
      )}`
    );
  };

  return <p onClick={handleClick}>Instagram</p>;
};
