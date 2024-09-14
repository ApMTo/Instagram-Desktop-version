import React, { useState } from "react";
import "./createPost.css";
import PostDragFileIcon from "../../utils/postIcons/PostDragFileIcon";
import UpladPost from "../UploadPost/UpladPost";
import { current } from "@reduxjs/toolkit";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";
import { useNavigate } from "react-router-dom";

const cloudinaryConfig = {
  cloudName: "apmto",
  uploadPreset: "besedka",
};

const CreatePost = () => {
  const [images, setImages] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    return result.secure_url;
  };

  const setPhoto = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    for (const file of files) {
      if (file) {
        const fileUrl = await handleFileUpload(file);
        if (fileUrl) {
          uploadedImages.push({
            type: file.type.startsWith("video/") ? "video" : "image",
            url: fileUrl,
          });
        }
      }
    }

    if (uploadedImages.length > 0) {
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
      setIsAdded(true);
    }
  };

  return (
    <>
      {!isDone ? (
        <div className="create_post">
          <div className="create_post_body">
            <div className="create_post_title">
              <h3>Create new post</h3>
              <span onClick={() => navigate(-1)}>
                <PostCloseIcon />
              </span>
            </div>
            <hr />

            <div className="create_post_main">
              <PostDragFileIcon />
              <h3>Drag photos and videos here</h3>

              <label htmlFor="mediaInput">Select from computer</label>
              <input
                type="file"
                name="addpost"
                id="mediaInput"
                accept="video/*,image/*"
                multiple
                onChange={setPhoto}
              />

              {isAdded ? (
                <button onClick={() => setIsDone(true)}>Next</button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ) : (
        <UpladPost images={images} />
      )}
    </>
  );
};

export default CreatePost;
