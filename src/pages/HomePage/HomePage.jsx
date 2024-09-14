import React, { useEffect } from "react";
import PostCart from "../../components/PostCart/PostCart";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "../../store/slices/posts/postSlice";
import { getFetchPosts } from "../../store/slices/API";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const { postsData } = useSelector(selectPosts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFetchPosts());
  }, []);

  return (
      <div className="homePage">
          <Outlet />
      {postsData.map((post) => {
        return <PostCart key={post.id} post={post} />;
      })}
    </div>
  );
};

export default HomePage;
