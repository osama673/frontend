import React from "react";
import { Carousel } from "antd";
import book6 from "../assets/book6.png";
import book9 from "../assets/book9.webp";
import book10 from "../assets/book10.png";
import book1 from "../assets/book1.webp";

function Slider() {
  return (
    <Carousel className="w-full h-[500px]" autoplay>
      <div>
        <img src={book6} alt="book6" className="w-full h-[500px]" />
      </div>
      <div>
        <img src={book9} alt="book9" className="w-full h-[500px]" />
      </div>
      <div>
        <img src={book10} alt="book10" className="w-full h-[500px]" />
      </div>
      <div>
        <img src={book1} alt="book1" className="w-full h-[500px]" />
      </div>
    </Carousel>
  );
}

export default Slider;
