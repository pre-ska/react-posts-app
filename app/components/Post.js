import React from "react";
import { Link } from "react-router-dom";

const Post = ({ post, onClick, noAuthor }) => {
  const date = new Date(post.createdDate).toLocaleString("hr", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <Link
      onClick={handleClick}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>{" "}
      <span className="text-muted small">
        {!noAuthor && <>by {post.author.username}</>} on {date}{" "}
      </span>
    </Link>
  );
};

export default Post;
