import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUsers } from "../../store/slices/users/usersSlice";
import PostArrowRightIcon from "../../utils/postIcons/PostArrowRightIcon";
import PostArrowLeftIcon from "../../utils/postIcons/PostArrowLeftIcon";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";
import "./uploadPost.css";
import { useNavigate } from "react-router-dom";
import { addFetchPost } from "../../utils/Requests/Requests";

const UpladPost = ({ images }) => {
  const { currentUser } = useSelector(selectUsers);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate("");
  const postRef = useRef(null);

  const handleNext = () => {
    setMediaIndex(mediaIndex + 1);
  };

  const handlePrev = () => {
    setMediaIndex(mediaIndex - 1);
  };
  

  const sharePost = async() => {
    if (postRef.current.value.trim() === "") return;
    const newPost = {
      id: new Date().getTime().toString(),
      userId: currentUser.id,
      postTitle: postRef.current.value,
      postImage: images,

      reactions: {
        likes: [],
      },
      comments: [],
    };
    await addFetchPost(newPost)
    setMediaIndex(0);
    setIsClosing(false);
    navigate('/');
  };

  return (
    <>
      <div className="upload_post">
        <div className="upload_post_body">
          {isClosing ? (
            <div className="close_post_upload">
              <div className="close_post_upload_body">
                <h4>Discard post?</h4>
                <span>If you leave, your edits won't be saved.</span>
                <div className="leave">
                  {" "}
                  <hr />
                  <p className="discard" onClick={() => navigate("/")}>
                    Discard
                  </p>
                  <hr />
                  <p onClick={() => setIsClosing(false)}>Cancle</p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div
            className="close_upload"
            onClick={() => {
              setIsClosing(true);
            }}
          >
            <PostCloseIcon />
          </div>
          <div className="upload_post_media">
            {images[mediaIndex].type === "video" ? (
              <video autoPlay loop>
                <source src={images[mediaIndex].url} type="video/mp4" />
              </video>
            ) : (
              <img src={images[mediaIndex].url} alt="" />
            )}
            <div className="upload_post_media_arrows">
              {mediaIndex !== 0 ? (
                <span className="left-arrow" onClick={handlePrev}>
                  <PostArrowLeftIcon />
                </span>
              ) : (
                <span></span>
              )}

              {mediaIndex !== images.length - 1 ? (
                <span className="right-arrow" onClick={handleNext}>
                  <PostArrowRightIcon />
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="upload_post_info">
            <div className="upload_user_info">
              <img src={currentUser?.userInfo?.profileImage} alt="" />
              <h4>{currentUser?.userName}</h4>
            </div>
            <div className="upload_post_info_text">
              <textarea ref={postRef} name="" id=""></textarea>
            </div>
            <hr />
            <button onClick={sharePost}>Post</button>
            <div className="upload_post_footer">
              <span>
                Your reel will be shared with your followers in their feeds and
                can be seen on your profile. It may also appear in places like
                Reels, where anyone can see it.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpladPost;
