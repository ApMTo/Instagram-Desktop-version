import React, { useEffect, useRef, useState } from "react";
import "./postPopUp.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  addLikeInPost,
  getPostById,
  getUserById,
} from "../../utils/Requests/Requests";
import PostLikeIcon from "../../utils/postIcons/PostLikeIcon";
import PostCommentsIcon from "../../utils/postIcons/PostCommentIcon";
import PostShareIcons from "../../utils/postIcons/PostShareIcon";
import PostSaveIcon from "../../utils/postIcons/PostSaveIcon";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";
import PostArrowRightIcon from "../../utils/postIcons/PostArrowRightIcon";
import PostArrowLeftIcon from "../../utils/postIcons/PostArrowLeftIcon";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/users/loginUserSlice";
import PostLikedIcon from "../../utils/postIcons/PostLikedIcon";
const PostPopUp = () => {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const { loggedInUser } = useSelector(selectLoggedInUser);
  const [user, setUser] = useState();
  const [commentsUsers, setCommentUsers] = useState([]);
  const [isLiked, setIsLiked] = useState();
  const navigate = useNavigate();
  const commentRef = useRef(null)


  useEffect(() => {
    const hasLiked = post?.reactions?.likes?.some(
      (like) => like === loggedInUser.id
    );
    setIsLiked(hasLiked);
  }, [loggedInUser, post]);

  useEffect(() => {
    const fetchData = async () => {
      const postRequest = await getPostById(postId);
      const userRequest = await getUserById(postRequest.userId);
      setPost(postRequest);
      setUser(userRequest);

      const commentsData = await Promise.all(
        postRequest.comments.map((comment) => getUserById(comment.userId))
      );

      setCommentUsers(commentsData);
    };

    fetchData();
  }, [postId, post]);

  const [mediaIndex, setMediaIndex] = useState(0);
  const handleNext = () => {
    setMediaIndex(mediaIndex + 1);
  };

  const handlePrev = () => {
    setMediaIndex(mediaIndex - 1);
  };

  const changeVideoMode = (e) => {
    if (e.target.paused) {
      e.target.play();
    } else {
      e.target.pause();
    }
  };

  const setLike = () => {
    setIsLiked((prevIsLiked) => {
      const isNowLiked = !prevIsLiked;

      const updatedLikes = isNowLiked
        ? [...post.reactions.likes, loggedInUser.id]
        : post.reactions.likes.filter((like) => like !== loggedInUser.id); // Убираем лайк

      const updatedPost = {
        ...post,
        reactions: {
          ...post.reactions,
          likes: updatedLikes,
        },
      };

      setPost(updatedPost);
      addLikeInPost(post.id, updatedPost);

      return isNowLiked;
    });
  };

  const addComment = () => {
    const updatedPost = {
      ...post,
      comments: [...post.comments, {
        id: new Date().getTime().toString(),
        userId: loggedInUser.id,
        comment: commentRef.current.value,
      }]
    }
    addLikeInPost(post.id, updatedPost);
    setPost(updatedPost)
    commentRef.current.value = '';
    };

  return (
    <div className="post_pop_up">
      <div className="post_pop_up_body">
        <div className="goBack" onClick={() => navigate(-1)}>
          <PostCloseIcon />
        </div>
        <div className="post_pop_up_post">
          <div className="post_media">
            {post?.postImage[mediaIndex]?.type === "video" ? (
              <video
                style={{ cursor: "pointer" }}
                autoPlay
                loop
                onClick={changeVideoMode}
              >
                <source
                  src={post?.postImage[mediaIndex]?.url}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img src={post?.postImage[mediaIndex]?.url} alt="" />
            )}
            <div className="upload_post_media_arrows">
              {mediaIndex !== 0 ? (
                <span className="left-arrow" onClick={handlePrev}>
                  <PostArrowLeftIcon />
                </span>
              ) : (
                <span></span>
              )}
              {mediaIndex !== post?.postImage?.length - 1 ? (
                <span className="right-arrow" onClick={handleNext}>
                  <PostArrowRightIcon />
                </span>
              ) : (
                ""
              )}
            </div>
          </div>{" "}
        </div>
        <div className="post_pop_up_comments">
          <div className="post_card_user">
            <div className="post_card_user_image pop_up_user_image">
              <img src={user?.userInfo?.profileImage} alt="profileImage" />
            </div>
            <div className="post_card_user_info">
              <div className="post_card_info_main">
                <h3>{user?.userName}</h3>
              </div>
            </div>
          </div>
          <hr />
          <div className="post_card_comments_info">
            <div className="post_card_pinned_comment">
              <div className="post_card_user pop_up_user">
                <div className="post_card_user_image pop_up_user_image">
                  <img src={user?.userInfo?.profileImage} alt="profileImage" />
                </div>
                <div className="post_card_user_info">
                  <div className="post_card_info_main">
                    <h3>{user?.userName}</h3>
                    <span className="post_message">{post?.postTitle}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="all_comments">
              {post?.comments?.map((comment, index) => (
                <div className={`comment ${comment.id}`} key={comment.id}>
                  <div className="post_card_user pop_up_user">
                    <div className="post_card_user_image pop_up_user_image">
                      <img src={commentsUsers[index]?.userInfo?.profileImage} alt="" />
                    </div>
                    <div className="post_card_user_info">
                      <div className="main_comment">
                        <div className="post_card_info_main">
                          <h3>{commentsUsers[index]?.userName}</h3>
                          <span className="post_message">
                            {comment?.comment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="post_message_footer">
            <div className="post_message_icons">
              <div className="main_icons" onClick={setLike}>
                {isLiked ? <PostLikedIcon /> : <PostLikeIcon />}
                <PostCommentsIcon />
                <PostShareIcons />
              </div>
              <div className="save_icon">
                <PostSaveIcon /> 
              </div>
            </div>
            <div className="post_footer_info">
              <h4>{post?.reactions?.likes?.length} likes</h4>
            </div>
            <div className="post_footer_comment">
              <textarea placeholder="Add a comment..." ref={commentRef}/>
              <span onClick={addComment}>Post</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPopUp;
