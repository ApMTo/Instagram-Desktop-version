import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./following.css";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";
import {
  getUserById,
  getUserWithName,
  updateUserById,
} from "../../utils/Requests/Requests";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/users/loginUserSlice";

const Following = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [followersData, setFollowersData] = useState();
  const { loggedInUser } = useSelector(selectLoggedInUser);

  useEffect(() => {
    const fetchData = async () => {
      const userRequest = await getUserWithName(username);
      setCurrentUser(userRequest[0]);
      const subData = await Promise.all(
        userRequest[0]?.userInfo?.following.map((follower) =>
          getUserById(follower)
        )
      );

      setFollowersData(subData);
    };

    fetchData();
  }, []);

  const removeUser = async (removedUser) => {
    const updatedUser = {
      ...removedUser,
      userInfo: {
        ...removedUser?.userInfo,
        followers: removedUser?.userInfo?.followers?.filter(
          (user) => user !== currentUser.id
        ),
      },
    };

    const updatedCurrentUser = {
      ...currentUser,
      userInfo: {
        ...currentUser?.userInfo,
        following: currentUser?.userInfo?.following?.filter(
          (user) => user !== removedUser.id
        ),
      },
    };
    await updateUserById(updatedUser?.id, updatedUser);
    await updateUserById(updatedCurrentUser?.id, updatedCurrentUser);
    setCurrentUser(updatedCurrentUser);
  };

  return (
    <div className="user_followers">
      <div className="followers_body">
        <div className="followers_header">
          <h3>Following</h3>
          <span onClick={() => navigate(`/user/${username}`)}>
            <PostCloseIcon />
          </span>
        </div>
        <div className="followers_section">
          {followersData?.map((follower) => {
            return (
              <div className="follower_item" key={follower.id}>
                <div className="follower_info">
                  <img
                    src={follower?.userInfo?.profileImage}
                    alt=""
                    onClick={() => navigate(`/user/${follower?.userName}`)}
                  />
                  <div className="follower_info_main">
                    <h4 onClick={() => navigate(`/user/${follower?.userName}`)}>
                      {follower?.userName}
                    </h4>
                    <span>
                      {follower?.firstName} {follower?.lastName}
                    </span>
                  </div>
                </div>
                <div className="follower_status">
                  {loggedInUser?.id === follower?.id ? (
                    <span className="you">That's you, cool one :)</span>
                  ) : (
                    <>
                      {currentUser?.id === loggedInUser?.id ? (
                        <button onClick={() => removeUser(follower)}>
                          Unfollow
                        </button>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Following;

// "1724841520035"
