import React, { useCallback } from "react";
import { Card } from "antd";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

//"book/wobqvfyccq4xemnrtg5z"
function BookCard({ id, title, description, img }) {
  const navigate = useNavigate();

  const cld = new Cloudinary({
    cloud: { cloudName: process.env.REACT_APP_CLOUDNAME },
  });
  // // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
  const myImage = cld.image(img);
  // // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(230).height(230));

  const handleClick = useCallback(() => {
    navigate("/details/" + id);
  }, [id, navigate]);

  return (
    <Card
      hoverable
      style={{ width: 230, height: 325 }}
      cover={<AdvancedImage cldImg={myImage} />}
      onClick={handleClick}
    >
      <Meta title={title} description={description} />
    </Card>
  );
}

export default BookCard;
