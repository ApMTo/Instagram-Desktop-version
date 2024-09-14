import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Users from "../pages/Users/Users";
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import { getFetchSessions } from "../store/slices/sessions/API";
import { selectSessions } from "../store/slices/sessions/sessionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkSessionCookie } from "../session/CookieManager";
import Layout from "../layout/Layout";
import HomePage from "../pages/HomePage/HomePage";
import PostPopUp from "../components/PostPopUp/PostPopUp";
import CreatePost from "../components/CreatePost/CreatePost";
import { getUserById } from "../utils/Requests/Requests";
import { selectUsers, setCurrentUser } from "../store/slices/users/usersSlice";
import UserPage from "../pages/UserPage/UserPage";
import Chat from "../components/Chat/Chat";
import Direct from "../pages/Direct/Direct";
import { selectLoggedInUser } from "../store/slices/users/loginUserSlice";
import { getFetchUserById } from "../store/slices/API";
import Followers from "../components/Followers/Followers";
import Following from "../components/Following/Following";
import EditPage from "../pages/Editpage/Editpage";

const AppRouter = () => {
  const dispatch = useDispatch();
  const { sessionsData, isSessionsLoading, isSessionsError } =
    useSelector(selectSessions);
  const { loggedInUser, isLoading, isError } = useSelector(selectLoggedInUser);

  useEffect(() => {
    dispatch(getFetchSessions());
  }, []);

  const [session, setSession] = useState({ pending: true, data: {} });

  const handleLogin = async (_session, user) => {
    setSession({ pending: false, data: _session });
  };

  useEffect(() => {
    if (isSessionsLoading) {
      return;
    }
    // 1. compare sessionsData items with cookie token (if exists)
    const cookieSession = checkSessionCookie();
    if (!cookieSession) {
      setSession({ pending: false, data: null });
    } else {
      const validSessions = sessionsData.filter(
        (s) => s.token === cookieSession.token
      );

      if (validSessions.length > 0) {
        setSession({ pending: false, data: validSessions[0] });

        const fetchData = async () => {
          const getCurrentUser = await getUserById(validSessions[0]?.user_id);
          dispatch(setCurrentUser(getCurrentUser));
        };
        fetchData();

        dispatch(getFetchUserById(validSessions[0].user_id));
      } else {
        setSession({ pending: false, data: null });
      }
    }
  }, [sessionsData]);

  if (session.pending) {
    return null;
  }

  return (
    <>
      <Routes>
        {session.data && (
          <>
            <Route path="/" element={<Layout />}>
              <Route path="p/:postId" element={<PostPopUp />} />
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/users" element={<Users />} />
              <Route path="/direct" element={<Direct />}>
                <Route path=":username" element={<Chat />} />
              </Route>
              <Route path="/user/:username" element={<UserPage />}>
                <Route path="followers" element={<Followers />} />
                <Route path="following" element={<Following />} />
              </Route>
              <Route path="/edit" element={<EditPage />}></Route>
            </Route>

            <Route path="/login" element={<Navigate to={"/"} />} />
            <Route path="/registration" element={<Navigate to={"/"} />} />

            <Route path="/create" element={<CreatePost />} />
            <Route path="*" element={<h2>Not found</h2>} />
          </>
        )}

        {!session.data && (
          <>
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route path="/registration" element={<Registration />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default AppRouter;
