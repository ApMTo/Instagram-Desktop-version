import { useNavigate, useParams } from "react-router-dom";
import {
  AddIcon,
  ConversIcon,
  VoiceIcon,
} from "../../utils/chatIcons/chatIcons";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../../store/slices/users/usersSlice";
import { useEffect, useRef, useState } from "react";
import {
  createChat,
  editChat,
  getUserWithName,
} from "../../utils/Requests/Requests";
import { selectChat } from "../../store/chat/chatSlice";
import { getFetchChats } from "../../store/slices/API";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";

const Chat = () => {
  const { currentUser } = useSelector(selectUsers);
  const [secondUser, setSecondUser] = useState(null);
  const { username } = useParams();
  const navigate = useNavigate();
  const { chatsData } = useSelector(selectChat);
  const dispatch = useDispatch();
  const [checkInput, setCheckInput] = useState(false);
  const [currentChat, setCurrentChat] = useState({});
  const [currentImage, setCurrentImage] = useState(false);
  const chatInputRef = useRef(null);

  useEffect(() => {
    dispatch(getFetchChats());
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async () => {
      const [fetchedUser] = await getUserWithName(username);
      setSecondUser(fetchedUser);
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const checkAndCreateChat = async () => {
      if (secondUser && currentUser && chatsData) {
        const existingChat = chatsData.find(
          (chat) =>
            (chat.user1 === currentUser.id && chat.user2 === secondUser.id) ||
            (chat.user2 === currentUser.id && chat.user1 === secondUser.id)
        );

        if (!existingChat) {
          const newChat = {
            id: new Date().getTime().toString(),
            user1: currentUser.id,
            user2: secondUser.id,
            messages: [],
          };

          await createChat(newChat);
          dispatch(getFetchChats());
        } else {
          setCurrentChat(existingChat);
        }
      }
    };

    if (secondUser && currentUser) {
      checkAndCreateChat();
    }
  }, [secondUser, currentUser, chatsData, dispatch]);

  const checkInputChat = (e) => {
    if (e.target.value.length >= 1) {
      setCheckInput(true);
    } else {
      setCheckInput(false);
    }
  };

  const sendText = async (type) => {
    const newMessage = {
      user_id: currentUser.id,
      message: type !== "media" ? chatInputRef.current.value : image[0],
    };

    const updatedChat = {
      ...currentChat,
      messages: [...(currentChat?.messages || []), newMessage],
    };

    setCurrentChat(updatedChat);

    await editChat(updatedChat.id, updatedChat);
    chatInputRef.current.value = "";
    setIsAdded(false);
  };

  const cloudinaryConfig = {
    cloudName: "apmto",
    uploadPreset: "besedka",
  };

  const [image, setImage] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

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
    const files = e.target.files[0];

    const uploadedImages = [];

    if (files) {
      const fileUrl = await handleFileUpload(files);
      if (fileUrl) {
        uploadedImages.push({
          type: files.type.startsWith("video/") ? "video" : "image",
          url: fileUrl,
        });
      }
    }

    if (uploadedImages.length > 0) {
      setImage(uploadedImages);
      setIsAdded(true);
    }
  };

  const openMedia = (image) => {
    setCurrentImage(image);
  };

  return (
    <>
      {typeof currentImage === "object" ? (
        <>
          <div className="sendPhoto">
            <div
              className="sendPhoto_body"
              style={{
                height: "400px",
              }}
            >
              <div
                className="close_sending"
                onClick={() => setCurrentImage(false)}
              >
                <PostCloseIcon />
              </div>

              {currentImage?.type === "video" ? (
                <video autoPlay loop>
                  <source src={currentImage?.url} type="video/mp4" />
                </video>
              ) : (
                <img src={currentImage?.url} alt="" />
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {isAdded ? (
        <div className="sendPhoto">
          <div className="sendPhoto_body">
            <div className="close_sending" onClick={() => setIsAdded(false)}>
              <PostCloseIcon />
            </div>

            {image[0]?.type === "video" ? (
              <video>
                {" "}
                <source src={image[0]?.url} type="video/mp4" />{" "}
              </video>
            ) : (
              <img src={image[0]?.url} alt="" />
            )}
            <button onClick={() => sendText("media")}>Send</button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="chat-container">
        <div className="header-info">
          <div
            className="chat-message friend-message"
            onClick={() => navigate(`/user/${secondUser?.userName}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={secondUser?.userInfo?.profileImage} alt="" />
            <span>
              {secondUser?.firstName} {secondUser?.lastName}
            </span>
          </div>
        </div>
        <hr />
        <div className="messages-container">
          <div className="chat-message-user-message">
            <img src={secondUser?.userInfo?.profileImage} alt="" />
            <span>
              {secondUser?.firstName} {secondUser?.lastName}
            </span>
            <button onClick={() => navigate(`/user/${secondUser.userName}`)}>
              View Profile
            </button>
          </div>

          <div className="users_messages">
            {currentChat?.messages?.map((chat, index) => {
              return (
                <>
                  {currentUser?.id === chat?.user_id ? (
                    <div className="message-right" key={index}>
                      <div className="chat_media">
                        {typeof chat.message === "object" ? (
                          chat.message.type === "video" ? (
                            <video onClick={() => openMedia(chat?.message)}>
                              <source
                                src={chat?.message?.url}
                                type="video/mp4"
                              />
                            </video>
                          ) : (
                            <img
                              src={chat.message.url}
                              alt="media"
                              onClick={() => openMedia(chat?.message)}
                            />
                          )
                        ) : (
                          <span>{chat.message}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="message-left" key={index}>
                      <img
                        src={secondUser?.userInfo?.profileImage}
                        alt=""
                        onClick={() =>
                          navigate(`/user/${secondUser?.userName}`)
                        }
                        className="chat_user_image"
                        style={{ cursor: "pointer" }}
                      />
                      <div className="chat_media">
                        {chat.message &&
                        typeof chat.message === "object" &&
                        chat.message.type === "video" ? (
                          <video onClick={() => openMedia(chat?.message)}>
                            <source src={chat.message.url} type="video/mp4" />
                          </video>
                        ) : chat.message && typeof chat.message === "object" ? (
                          <img src={chat.message.url} alt="media" />
                        ) : (
                          <span>{chat.message}</span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className="input-fields">
          <div className="input-icons">
            {!checkInput ? (
              <label htmlFor="chatFile">
                <AddIcon />
              </label>
            ) : (
              <span onClick={sendText}>Send</span>
            )}
            <input
              type="file"
              id="chatFile"
              style={{ display: "none" }}
              onChange={setPhoto}
            />
          </div>
          <textarea
            ref={chatInputRef}
            type="text"
            placeholder="Message..."
            onChange={checkInputChat}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
