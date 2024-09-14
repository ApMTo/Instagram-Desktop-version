import React, { useEffect, useState, useMemo } from "react";
import "./direct.css";
import Chat from "../../components/Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../../store/slices/users/usersSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MessengerIcon } from "../../utils/chatIcons/chatIcons";
import { selectChat } from "../../store/chat/chatSlice";
import { getUserById } from "../../utils/Requests/Requests";
import { getFetchChats } from "../../store/slices/API";

const Direct = () => {
  const { currentUser } = useSelector(selectUsers);
  const location = useLocation();
  const currentPath = location.pathname;
  const { chatsData } = useSelector(selectChat);
  const [directUsers, setDirectUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFetchChats());
  }, []);

  const filteredChats = useMemo(() => {
    if (!currentUser || !chatsData) return [];
    return chatsData.filter(
      (chat) => chat.user1 === currentUser.id || chat.user2 === currentUser.id
    );
  }, [currentUser, chatsData]);

  useEffect(() => {
    const getAllUsers = async () => {
      if (filteredChats.length === 0) return;

      const userPromises = filteredChats.map(async (chat) => {
        if (chat.user1 === currentUser.id) {
          return await getUserById(chat.user2);
        } else {
          return await getUserById(chat.user1);
        }
      });

      const users = await Promise.all(userPromises);
      setDirectUsers(users);
    };

    getAllUsers();
  }, [filteredChats, currentUser]);

  return (
    <>
      <div className="direct">
        <div className="direct_header">
          <img src={currentUser?.userInfo?.profileImage} alt="" />
          <h2>{currentUser.userName}</h2>
        </div>
        <div className="direct_body">
          <div className="direct_body_title">
            <h3>Messages</h3>
          </div>
          <div className="direc_users">
            {directUsers.map((user) => {
              return (
                <div
                  className={`direct_user ${user?.id} ${user?.firstName} ${user?.lastName}`}
                  onClick={() => navigate(`${user?.userName}`)}
                  key={user?.id}
                >
                  <img src={user?.userInfo?.profileImage} alt="" />
                  <span>
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {currentPath === "/direct" ? (
        <div className="start_chat">
          <div className="start_chat_body">
            <MessengerIcon />
            <div>
              <span>Your messages</span>
              <span className="send_messages">
                Send a message to start a chat.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="main_chat">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Direct;
