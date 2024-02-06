import React, { useCallback, useEffect, useState } from "react";
import { Menu } from "antd";
import {
  GlobalOutlined,
  HeartOutlined,
  RedditOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BookCard from "../components/BookCard";

function Category() {
  const [publicBooks, setPublicBooks] = useState([]);
  const [filtredBooks, setFiltredBooks] = useState([]);
  const items = [
    getItem("Romance", "romance", <HeartOutlined />),
    getItem("Adventure", "adventure", <GlobalOutlined />),
    getItem("Science", "science", <HourglassOutlined />),
    getItem("Fantasy", "fantasy", <RedditOutlined />),
    getItem("Tragedy", "tragedy", <RedditOutlined />),
    getItem("Comedy", "comedy", <RedditOutlined />),
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/public/books")
      .then((response) => {
        setPublicBooks(response.data.data);
        setFiltredBooks(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onChange = useCallback(
    (e) => {
      const filteredBooks = publicBooks.filter(
        (book) => book.category === e.key
      );
      setFiltredBooks(filteredBooks);
    },
    [publicBooks]
  );
  return (
    <div className="flex">
      <div className="w-[300px]">
        <Menu
          style={{ height: "100%", width: "300px" }}
          onClick={onChange}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["1"]}
          mode="inline"
          items={items}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 px-2">
        {filtredBooks.map((book) => (
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

export default Category;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
