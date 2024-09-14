import React, { useEffect, useState } from "react";
import "./Editpage.css";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/slices/users/loginUserSlice";
import PostCloseIcon from "../../utils/postIcons/PostCloseIcon";
import { updateUserById } from "../../utils/Requests/Requests";
export default function Editpage() {
  const { loggedInUser } = useSelector(selectLoggedInUser);
  const [image, setImage] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [bioLimit, setBioLimit] = useState(0);
  const [bioArrea, setBioArrea] = useState("");

  const cloudinaryConfig = {
    cloudName: "apmto",
    uploadPreset: "besedka",
  };
  useEffect(() => {
    setBioLimit(loggedInUser?.userInfo?.bio?.length);
    setBioArrea(loggedInUser?.userInfo?.bio);
  }, [loggedInUser]);

  const submitChanges = () => {
    const updatedUser = {
      ...loggedInUser,
      userInfo: {
        ...loggedInUser?.userInfo,
        bio: bioArrea,
      },
    };
    updateUserById(updatedUser.id, updatedUser);
    window.location.reload();
  };

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

  const applyPhoto = () => {
    const updatedUser = {
      ...loggedInUser,
      userInfo: {
        ...loggedInUser?.userInfo,
        profileImage: image[0].url,
      },
    };

    updateUserById(updatedUser.id, updatedUser);
    window.location.reload();
  };
  const changeBio = (e) => {
    setBioArrea(e.target.value);
    setBioLimit(e.target.value.length);
  };

  return (
    <>
      {isAdded ? (
        <div className="apply_photo">
          <div className="apply_photo_body">
            <div className="close_sending" onClick={() => setIsAdded(false)}>
              <PostCloseIcon />
            </div>

            <img src={image[0]?.url} alt="" />

            <button className="apply_btn" onClick={() => applyPhoto()}>
              Apply
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="editpage">
        <div className="editpage_box">
          <div className="changePhoto">
            <h4 className="changePhoto-text">Edit profile</h4>
            <div className="changePhoto-box">
              <div className="changePhoto-imgs">
                <img
                  className="changePhoto-img"
                  src={loggedInUser?.userInfo?.profileImage}
                  alt=""
                />
                <span className="changePhoto-imgs-span">
                  <span>{loggedInUser?.userName}</span>
                  <p>
                    {loggedInUser?.firstName} {loggedInUser?.lastName}
                  </p>
                </span>
              </div>
              <label htmlFor="setProfilePhoto" className="changePhoto-btn">
                Change photo
              </label>
              <input
                type="file"
                accept=""
                id="setProfilePhoto"
                style={{ display: "none" }}
                onChange={setPhoto}
              />
            </div>
          </div>
          <div className="website">
            <h4 className="website-text-h4">Website</h4>

            <div className="website-box">
              <span className="website-text">Website</span>
            </div>
            <span className="website-span">
              Editing your links is only available on mobile. Visit the
              Instagram app and edit your profile to change the websites in your
              bio.
            </span>
          </div>
          <div className="bio">
            <h4 className="website-text-h4">Bio</h4>
            <textarea
              className="bio-area"
              placeholder="Bio"
              onChange={changeBio}
              defaultValue={loggedInUser?.userInfo?.bio}
              maxLength={80}
            ></textarea>
            <span className="bio_counter">{bioLimit}/80</span>
          </div>

          <div className="submit-btn">
            <button className="submit-btnn" onClick={submitChanges}>
              Submit
            </button>
          </div>
          <footer className="registration_footerr">
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
      </div>
    </>
  );
}
