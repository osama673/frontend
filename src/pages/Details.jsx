import React, { useState, useEffect, useCallback } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Input, Button } from "antd";
import { useSelector } from "react-redux";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";

const { TextArea } = Input;
function Details() {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.currentUser.user);
  const [book, setBook] = useState();
  const [dateOfPublication, setDateOfPublication] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const addComment = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/user/comment/create", {
        comment: comment,
        book: id,
        user: currentUser?.id,
      });
      setComments([{ comment: comment, user: currentUser }, ...comments]);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  }, [id, currentUser, comment, comments]);

  const addReservation = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/user/reservation/create", {
        bookId: id,
        userId: currentUser?.id,
      });
      setIsDisabled(true);
    } catch (error) {
      console.error(error);
    }
  }, [currentUser, id]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/comment/" + id)
      .then((response) => {
        setComments(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/book/" + id)
      .then((response) => {
        setBook(response.data.data);
        setDateOfPublication(
          format(parseISO(response.data.data.dateOfPublication), "dd/MM/yyyy")
        );
      })
      .catch((error) => {
        console.error(error);
      });
    if (currentUser) {
      axios
        .get(
          "http://localhost:5000/api/user/reservation/details/" +
            currentUser?.id +
            "/" +
            id
        )
        .then((response) => {
          if (response.data.data) setIsDisabled(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id, currentUser]);

  const cld = new Cloudinary({
    cloud: { cloudName: process.env.REACT_APP_CLOUDNAME },
  });

  // Instantiate a CloudinaryImage object for the image with the public ID, 'docs/models'.
  const myImage = cld.image(book?.cover);

  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().width(270).height(400));

  return (
    <div className="flex flex-col py-4 px-[150px] min-h-screen bg-[#fafafa] gap-4">
      <div className="border-[1px] rounded border-[#4497c6] bg-[white]">
        <div className=" flex  mx-10 mt-10 mb-20">
          <div className="flex-1">
            <div className="flex flex-1 justify-center">
              <strong>{book?.title}</strong>
            </div>
            <div className="text-sm pt-[100px]">
              <span className="font-bold mr-2">Description :</span>
              {book?.description}
            </div>
            <div className="text-sm pt-2">
              <span className="font-bold mr-2">Author :</span>
              {book?.author}
            </div>
            <div className="text-sm pt-2">
              <span className="font-bold mr-2">Date of publication :</span>
              {dateOfPublication}
            </div>
            <div className="text-sm pt-2">
              <span className="font-bold mr-2">Category :</span>
              {book?.category}
            </div>
          </div>
          <div>
            <div className="w-[270px] h-[400px]">
              <AdvancedImage cldImg={myImage} className="rounded-lg" />
            </div>
            <div className="flex justify-center pt-4">
              <Button
                type="primary"
                className="bg-[#4497c6] w-[200px]"
                onClick={addReservation}
                disabled={isDisabled || !currentUser}
              >
                Reservation
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[1px] rounded border-[#4497c6] bg-[white] p-4 flex flex-col items-start gap-4">
        <strong className="text-center text-xl">Comments:</strong>

        <div className="flex w-full items-center gap-1">
          <TextArea
            rows={4}
            className="w-full"
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />

          <Button
            type="primary"
            shape="circle"
            className="bg-[#4497c6]"
            onClick={addComment}
            disabled={!comment || !currentUser ? true : false}
            icon={<SendOutlined />}
          />
        </div>

        <div>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item key={item.title} className="w-full">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.user?.firstName[0]}
                    </Avatar>
                  }
                  title={item.user.firstName}
                />
                {item.comment}
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Details;

// const IconText = ({ icon, text }) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// );
