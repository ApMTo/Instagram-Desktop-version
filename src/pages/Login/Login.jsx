import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import {
  ErrorCode,
  getFetchUserById,
  loginUser,
} from "../../store/slices/API";

import { selectLoggedInUser } from "../../store/slices/users/loginUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAddSession } from "../../store/slices/sessions/startSessionSlice";
import { addSessionCookie } from "../../session/CookieManager";
import { addSession } from "../../store/slices/sessions/API";
export default function Login({handleLogin}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedInUser, isLoading, isError } = useSelector(selectLoggedInUser);
  const { session, isAddSessionLoading, isAddSessionError } = useSelector(selectAddSession);

  const isInvalidUserName =
    isError && isError == ErrorCode.LOGIN_FAILURE_INVALID_USERNAME;
  const isInvalidPasword =
    isError && isError == ErrorCode.LOGIN_FAILURE_INVALID_PASSWORD;


  useEffect(() => {
    if (loggedInUser.id && !isAddSessionLoading && !isAddSessionError) {
      // session stored
      // redirect home page


      handleLogin(session, loggedInUser)
    }
  }, [session]);

  useEffect(() => {
    if (loggedInUser.id && !isLoading && !isError) {
        // credentials ara valid, Start session
        const token = addSessionCookie();
        dispatch(
        addSession({
          user_id: loggedInUser.id,
          token: token,
        })
      );
    }
  }, [loggedInUser]);

  async function handleSubmit(e) {

    e.preventDefault();
    //1.  TODO Check Inputs are not empty
    let username = e.target[0].value
    let password = e.target[1].value;

    // 2. Login (Check Credentials)
    dispatch(loginUser({ username, password }));
  }



  
  return (
    <div className="login">
      <div className="login_box">
        <h1 className="login_name">Instagram</h1>

        <form className="login_form" onSubmit={handleSubmit}>
          <input
            className="login_form-input"
            type="text"
            placeholder="Phone number, username, or email"
          />

          {isInvalidUserName && (
            <p className="error">Username does not exist</p>
          )}

          <input
            className="login_form-input"
            type="password"
            placeholder="Password"
          />

          {isInvalidPasword && (
            <p className="error">Invalid username or password.</p>
          )}

          <button className="login_btn">Log in</button>
        </form>
        <div className="registration_Inputs-dash">
          <div className="dash"></div>
          <span className="dash_text">OR</span>
          <div className="dash"></div>
        </div>
        <h5 className="login_titel">Log in with Facebook</h5>
      </div>
      <div className="reg_button">
        <span className="reg_buton-span">
          Don't have an account?{" "}
          <span className="singup-btn">
            {" "}
            <Link to="/registration">Sign up</Link>{" "}
          </span>
        </span>
      </div>
    </div>
  );


  }
