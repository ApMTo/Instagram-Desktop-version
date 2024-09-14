import React, { useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Registration.css";
import { createNewAccount } from "../../utils/Requests/Requests";
import { useDispatch, useSelector } from "react-redux";
import { selectRegisterUser } from "../../store/slices/users/registerUserSlice";
import { useNavigate, Link } from "react-router-dom";
import { ErrorCode, registerUser } from "../../store/slices/API";

export default function Registration() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { registerUser, isLoading, isError } = useSelector(selectRegisterUser);

  useEffect(() => {
    if (registerUser?.id && !isLoading && !isError) {
      navigate("/login");
    }
  }, [registerUser, isLoading, isError, navigate]);

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  };

  const createUser = (values) => {
    const newUser = {
      id: new Date().getTime().toString(),
      firstName: values.firstName,
      lastName: values.lastName,
      userName: values.userName.toLowerCase(),
      password: values.password,
      userInfo: {
        bio: "No bio yet",
        address: "None",
        city: "Unknown",
        country: "Unknown",
        phone: "Unknown",
        email: values.email,
        profileImage: "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg?ssl=1",
        followers: [],
        following: [],
        session: [],
      },
    };
    createNewAccount(newUser);
    formRef.current.reset();
    navigate('/login')
    return newUser;
  };

  const onSubmit = async (values) => {
    const userName = values.userName.toLowerCase();
    const user = createUser(values);
    dispatch(registerUser(user));
  };

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is Required").email("Invalid email address"),
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is Required"),
    userName: Yup.string().required("Username is Required"),
    password: Yup.string().required("Password is Required"),
  });

  return (
    <div className="registration">
      <div className="registration_box">
        <div className="registration_Inputs">
          <h1 className="registration_name">Instagram</h1>
          <span className="registration_titel">
            Sign up to see photos and videos from your friends
          </span>
          <button className="registration_btn-1">Log in with Facebook</button>
          <div className="registration_Inputs-dash">
            <div className="dash"></div>
            <span className="dash_text">OR</span>
            <div className="dash"></div>
          </div>

          {isError && isError === ErrorCode.REGISTRATION_FAILURE_USERNAME_EXISTS && (
            <div className="errors block">
              <span>User with username <b>{formRef.current[3].value}</b> already exists!</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className="inputs_reg" ref={formRef}>
                <Field name="email" placeholder="Email" className="input-reg" />
                <div className="errors">
                  <ErrorMessage name="email" component="span" />
                </div>
                <Field name="firstName" placeholder="First Name" className="input-reg" />
                <div className="errors">
                  <ErrorMessage name="firstName" component="span" />
                </div>
                <Field name="lastName" placeholder="Last Name" className="input-reg" />
                <div className="errors">
                  <ErrorMessage name="lastName" component="span" />
                </div>
                <Field name="userName" placeholder="Username" className="input-reg" />
                <div className="errors">
                  <ErrorMessage name="userName" component="span" />
                </div>
                <Field name="password" placeholder="Password" className="input-reg" type="password" />
                <div className="errors">
                  <ErrorMessage name="password" component="span" />
                </div>
                <span className="registration_titel-2">
                  People who use our service may have uploaded your contact information to Instagram.
                  <p className="titel-p">Learn More</p>
                </span>
                <span className="registration_titel-2 titel-v2">
                  By signing up, you agree to our{" "}
                  <span className="titel-p">Terms, Privacy Policy</span> and{" "}
                  <span className="titel-p">Cookies Policy</span>.
                </span>
                <button className="registration_btn-2" type="submit">
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="registration_login-button">
          <h3 className="registration_text-2">
            Have an account? <span className="text_2-span"><Link to={'/login'}>Log in</Link></span>
          </h3>
        </div>
      </div>
      <footer className="registration_footer">
        <span className="footer_span">Meta</span>
        <span className="footer_span">About</span>
        <span className="footer_span">Blog</span>
        <span className="footer_span">Jobs</span>
        <span className="footer_span">Help</span>
        <span className="footer_span">API</span>
        <span className="footer_span">Privacy</span>
        <span className="footer_span">Terms</span>
        <span className="footer_span">Locations</span>
        <span className="footer_span">Instagram Lite</span>
        <span className="footer_span">Threads</span>
        <span className="footer_span">Contact Uploading & Non-Users</span>
        <span className="footer_span">Meta Verified</span>
        <span className="footer_span">© 2024 Instagram from Meta</span>
      </footer>
    </div>
  );
}
