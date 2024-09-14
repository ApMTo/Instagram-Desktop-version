import React, { useEffect, useState } from "react";
import "./userPage.css";
import { SvgSettings } from "../../utils/IconsUserPage/IconsUser";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getPosts,
  getUserWithName,
  updateUserById,
} from "../../utils/Requests/Requests";
import { useDispatch, useSelector } from "react-redux";
import PostLikeIcon from "../../utils/postIcons/PostLikeIcon";
import PostCommentIcon from "../../utils/postIcons/PostCommentIcon";
import {
  selectLoggedInUser,
  updateUser,
} from "../../store/slices/users/loginUserSlice";
import { clearSessionCookie } from "../../session/CookieManager";

export default function UserPage() {
  const [isOpened, setIsOpened] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { username } = useParams();
  const { loggedInUser } = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const profileUser = await getUserWithName(username);
      setCurrentUser(profileUser[0]);
      const postsData = await getPosts();
      setPosts(postsData);
    };
    fetchData();
  }, [username]);

  const checkFollower = async () => {
    const hasFollowing = currentUser?.userInfo?.followers?.some(
      (follower) => follower === loggedInUser.id
    );

    const updatedUser = {
      ...currentUser,
      userInfo: {
        ...currentUser?.userInfo,
        followers: hasFollowing
          ? currentUser?.userInfo?.followers?.filter(
              (follower) => follower !== loggedInUser.id
            )
          : [...currentUser?.userInfo?.followers, loggedInUser.id],
      },
    };
    const updatedLoggedInUser = {
      ...loggedInUser,
      userInfo: {
        ...loggedInUser?.userInfo,
        following: hasFollowing
          ? loggedInUser?.userInfo?.following?.filter(
              (follower) => follower !== currentUser.id
            )
          : [...loggedInUser?.userInfo?.following, currentUser.id],
      },
    };

    setCurrentUser(updatedUser);
    dispatch(updateUser(updatedLoggedInUser));
    updateUserById(updatedUser.id, updatedUser);
    updateUserById(updatedLoggedInUser.id, updatedLoggedInUser);
  };
  const logOut = () => {
    clearSessionCookie();
    window.location.reload();
  };
  return (
    <>
      <Outlet />
      {isOpened && (
        <div className="boxOppen">
          <div className="settings">
            <p
              className="settings_link"
              onClick={() => logOut()}
              style={{ cursor: "pointer" }}
            >
              Log Out
            </p>
            <NavLink
              className="settings_link v3"
              onClick={() => setIsOpened(false)}
            >
              Cancel
            </NavLink>
          </div>
        </div>
      )}
      <div className="userpage">
        <div className="user_info">
          <div className="user_img">
            <img
              className="user_profile_image"
              src={currentUser?.userInfo?.profileImage}
              alt=""
            />
          </div>
          <div className="user_account">
            <div className="username_editprofil">
              <span className="username">{currentUser?.userName}</span>
              {loggedInUser.id === currentUser?.id ? (
                <>
                  <button className="username_editprofile_btn" onClick={() => navigate(`/edit`)}>
                    Edit profile
                  </button>
                  <button className="username_editprofile_btn">
                    View archive
                  </button>
                  <button
                    className="username_settings"
                    onClick={() => setIsOpened(true)}
                  >
                    <SvgSettings />
                  </button>
                </>
              ) : (
                <>
                  {currentUser?.userInfo?.followers?.some(
                    (userid) => userid === loggedInUser.id
                  ) ? (
                    <button
                      className="username_unfollow_btn"
                      onClick={checkFollower}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      className="username_follow_btn"
                      onClick={checkFollower}
                    >
                      {loggedInUser?.userInfo?.followers?.some(
                        (follower) => follower === currentUser?.id
                      )
                        ? "Follow Back"
                        : "Follow"}
                    </button>
                  )}
                  <button
                    className="username_editprofile_btn"
                    onClick={() => navigate(`/direct/${currentUser?.userName}`)}
                  >
                    Message
                  </button>
                </>
              )}
            </div>
            <div className="followers">
              <span
                className="followers_span"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`followers`)}
              >
                {currentUser?.userInfo?.followers?.length} followers
              </span>
              <span
                className="followers_span"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`following`)}
              >
                {currentUser?.userInfo?.following?.length} following
              </span>
            </div>
            <span className="spn_for_account">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <span className="spn_for_account account_bio">{currentUser?.userInfo?.bio}</span>
          </div>
        </div>

        <div className="user__post">
          <NavLink className="navLink_post">POSTS</NavLink>
        </div>
        <div className="all_user_posts">
          {posts.length >= 1 ? (
            posts
              ?.filter((post) => post?.userId === currentUser?.id)
              .map((post) => (
                <div
                  key={post.id}
                  className="post_item"
                  onClick={() => navigate(`/p/${post.id}`)}
                >
                  {post.postImage[0]?.type === "video" ? (
                    <video className="post_media">
                      <source src={post.postImage[0]?.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="post_media"
                      src={post.postImage[0]?.url}
                      alt="Post"
                    />
                  )}
                  <div className="post_hover_info">
                    <span>
                      <PostLikeIcon /> {post?.reactions?.likes?.length}
                    </span>
                    <span>
                      <PostCommentIcon /> {post?.comments?.length}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <h3>No posts available</h3>
          )}
        </div>
      </div>
    </>
  );
}
