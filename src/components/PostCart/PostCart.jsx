import React, { useEffect, useRef, useState } from "react";
import "./postCart.css";
import PostLikeIcon from "../../utils/postIcons/PostLikeIcon";
import PostCommentIcon from "../../utils/postIcons/PostCommentIcon";
import PostShareIcon from "../../utils/postIcons/PostShareIcon";
import PostSaveIcon from "../../utils/postIcons/PostSaveIcon";
import { Outlet, useNavigate } from "react-router-dom";
import { addLikeInPost, getUserById } from "../../utils/Requests/Requests";
import PostArrowLeftIcon from "../../utils/postIcons/PostArrowLeftIcon";
import PostArrowRightIcon from "../../utils/postIcons/PostArrowRightIcon";
import PostLikedIcon from "../../utils/postIcons/PostLikedIcon";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/users/loginUserSlice";

const PostCart = ({ post }) => {
  const [commentText, setCommentText] = useState("");
  const { loggedInUser } = useSelector(selectLoggedInUser);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState();
  const [currentPost, setCurrentPost] = useState(post);
  const videoRef = useRef(null);
  const commentRef = useRef(null)

  useEffect(() => {
    const hasLiked = currentPost.reactions.likes.some(like => like === loggedInUser.id);
    setIsLiked(hasLiked);
  }, [loggedInUser, currentPost]);

  const goToComment = () => {
    navigate(`/p/${post.id}`);
  };

  const handleNext = () => {
    setMediaIndex(mediaIndex + 1);
  };

  const handlePrev = () => {
    setMediaIndex(mediaIndex - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const getUser = await getUserById(post.userId);
      setUser(getUser);
    };
    fetchData();
  }, [post.userId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [mediaIndex]);

  const changeVideoMode = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };
  const setLike = () => {
    setIsLiked((prevIsLiked) => {
      const isNowLiked = !prevIsLiked;
      
      const updatedLikes = isNowLiked
        ? [...currentPost.reactions.likes, loggedInUser.id]
        : currentPost.reactions.likes.filter((like) => like !== loggedInUser.id); // Убираем лайк
  
      const updatedPost = {
        ...currentPost,
        reactions: {
          ...currentPost.reactions,
          likes: updatedLikes,
        },
      };
  
      setCurrentPost(updatedPost);
      addLikeInPost(currentPost.id, updatedPost);
  
      return isNowLiked;
    });
  };

  const addComment = () => {
    const updatedPost = {
      ...currentPost,
      comments: [...currentPost.comments, {
        id: new Date().getTime().toString(),
        userId: loggedInUser.id,
        comment: commentRef.current.value,
      }]
    }
    addLikeInPost(currentPost.id, updatedPost);
    setCurrentPost(updatedPost)
    commentRef.current.value = '';
    };
  
  return (
    <>
      <div className="post_card">
        <div className="post_card_header">
          <div className="post_card_user">
            <div className="post_card_user_image">
              <img src={user?.userInfo?.profileImage} alt="" />
            </div>
            <div className="post_card_user_info">
              <div className="post_card_info_main">
                <h3 onClick={() => navigate(`/user/${user.userName}`)}>
                  {user.userName}
                </h3>
              </div>
              <div className="post_card_audio">
                <span>Original audio</span>
              </div>
            </div>
          </div>
          <div className="post_card_circle">
            <span>...</span>
          </div>
        </div>
        <div className="post_card_body">
          <div className="post_media">
            {currentPost?.postImage[mediaIndex]?.type === "video" ? (
              <video
                style={{ cursor: "pointer" }}
                ref={videoRef}
                autoPlay
                loop
                onClick={changeVideoMode}
              >
                <source
                  src={currentPost?.postImage[mediaIndex]?.url}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img src={currentPost?.postImage[mediaIndex]?.url} alt="" />
            )}
            <div className="upload_post_media_arrows">
              {mediaIndex !== 0 ? (
                <span className="left-arrow" onClick={handlePrev}>
                  <PostArrowLeftIcon />
                </span>
              ) : (
                <span></span>
              )}
              {mediaIndex !== currentPost?.postImage?.length - 1 ? (
                <span className="right-arrow" onClick={handleNext}>
                  <PostArrowRightIcon />
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="post_card_footer">
          <div className="post_card_icons">
            <div className="post_card_main_icons">
              <div className="like_icon">
                <span onClick={setLike}>
                  {isLiked ? <PostLikedIcon /> : <PostLikeIcon />}
                </span>
              </div>
              <div className="comment_icon">
                <span onClick={goToComment}>
                  <PostCommentIcon />
                </span>
              </div>
              <div className="share_icon">
                <span>
                  <PostShareIcon />
                </span>
              </div>
            </div>
            <div className="save_icon">
              <PostSaveIcon />
            </div>
          </div>
          <div className="post_likes">
            <span>{currentPost?.reactions?.likes?.length} likes</span>
          </div>
          <div className="post_title">
            <span>
              <strong>{user.userName} </strong>
              {currentPost.postTitle}
            </span>
          </div>
          <div className="post_comments">
            {currentPost.comments.length >= 1 ? (
              <span onClick={goToComment}>
                View all {post.comments.length} comments
              </span>
            ) : (
              <span>No comments available</span>
            )}
          </div>
          <div className="post_add_comment">
            <textarea
              placeholder="Add a comment..."
              ref={commentRef}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {commentText.length >= 1 ? <span onClick={addComment}>Post</span> : ""}
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default PostCart;
