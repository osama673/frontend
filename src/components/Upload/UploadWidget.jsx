import React, { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { setFileId, setFileName } from "./uploadSlice";

function UploadWidget({ name }) {
  const dispatch = useDispatch();
  const cloudinaryRef = useRef(null);
  const widgetRef = useRef(null);
  const [nameFile, setNameFile] = useState("");

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDNAME,
        uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! ", result.info.public_id);
          dispatch(setFileName(result.info.original_filename));
          dispatch(setFileId(result.info.public_id));
          setNameFile(result.info.original_filename);
        }
      }
    );
  }, [dispatch]);

  return (
    <div className="flex items-center space-x-3">
      <Button onClick={() => widgetRef.current.open()}>Upload</Button>
      <div className="truncate">{nameFile ? nameFile : name}</div>
    </div>
  );
}

export default UploadWidget;
