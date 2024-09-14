import React, { useEffect, useState } from "react";
import "./search.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUsers } from "../../store/slices/users/usersSlice";
import { getFetchUsers } from "../../store/slices/API";
import { useNavigate } from "react-router-dom";
const Search = ({ setSearchVisible }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(selectUsers);
  const [currentUsers, setCurrentUsers] = useState([]);
  const navigate = useNavigate("");
  useEffect(() => {
    dispatch(getFetchUsers());
  }, []);

  const checkUsers = (e) => {
    const text = e.target.value;
    if (text.trim() === "") {
      setCurrentUsers([]);
    }

    const getUsers = data.filter((user) => user?.userName?.includes(text));
    setCurrentUsers(getUsers);
  };

  return (
    <div className="search">
      <div className="search_header">
        <h2>Search</h2>
        <input type="text" placeholder="Search" onChange={checkUsers} />
      </div>

      <div className="search_results">
        <h3>Result</h3>
        <div className="result_body">
          {!currentUsers[0]?.id ? (
            <div className="no_users">
              <span>No one was found</span>
            </div>
          ) : (
            <>
              {currentUsers?.map((user) => {
                return (
                  <div
                    className="search_user"
                    key={user?.id}
                    onClick={() => {
                      navigate(`/user/${user?.userName}`);
                      setSearchVisible(false);
                    }}
                  >
                    <img src={user?.userInfo?.profileImage} alt="" />
                    <div className="search_user_info">
                      <h4>{user?.userName}</h4>
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
