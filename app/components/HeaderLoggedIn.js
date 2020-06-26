import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const HeaderLoggedIn = () => {
  const { user, unreadChatCount } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const handleLogout = () => {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have successfuly logged out"
    });
  };

  const handleSearchIcon = e => {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  };

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={handleSearchIcon}
        data-for="search"
        data-tip="Search"
        href="#"
        className="text-white mr-3 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        className={
          "mr-3 header-chat-icon " +
          (unreadChatCount ? "text-danger" : "text-white")
        }
        data-for="chat"
        data-tip="Chat">
        <i className="fas fa-comment"></i>
        {unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {unreadChatCount < 10 ? unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        data-for="profile"
        data-tip="Profile"
        to={`/profile/${user.username}`}
        className="mr-3">
        <img className="small-header-avatar" src={user.avatar} />
      </Link>{" "}
      <Link
        data-for="profile"
        data-tip="Profile"
        to={`/profile/${user.username}`}
        className="text-white mr-3">
        {user.username}
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>{" "}
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggedIn;
