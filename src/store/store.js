import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./slices/users/usersSlice";
import { postsReducer } from "./slices/posts/postSlice";
import { commentsReducer } from "./slices/comments/commentsSlice";
import { sessionsReducer } from "./slices/sessions/sessionsSlice";
import { userReducer } from "./slices/users/singleUserSlice";
import { loggedInUserReducer } from "./slices/users/loginUserSlice";
import { addSessionReducer } from "./slices/sessions/startSessionSlice";
import { registerUserReducer } from "./slices/users/registerUserSlice";
import { chatReducer } from "./chat/chatSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    loggedInUser: loggedInUserReducer,
    registerUser: registerUserReducer,
    user: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
    sessions: sessionsReducer,
    session: addSessionReducer,
    chat: chatReducer,
  },
});

export default store;
