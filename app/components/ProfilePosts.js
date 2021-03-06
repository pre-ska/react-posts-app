import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

const ProfilePosts = () => {
  const { username } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          canceltoken: ourRequest.token
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchPosts();

    return () => ourRequest.cancel();
  }, [username]);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className="list-group">
      {posts.map(post => (
        <Post key={post._id} post={post} noAuthor />
      ))}
    </div>
  );
};

export default ProfilePosts;
