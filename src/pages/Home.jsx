import React, { useEffect } from "react";
import Slider from "../components/Slider";
import BookCard from "../components/BookCard";
import axios from "axios";
import { useState } from "react";

function Home() {
  const [publicBooks, setPublicBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/public/books")
      .then((response) => {
        setPublicBooks(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <Slider />
      <div className="flex flex-wrap items-center gap-4 py-4">
        {publicBooks.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            description={book.description}
            img={book.cover}
            id={book._id}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
