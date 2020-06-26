import React, { useContext } from "react";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const HeaderLoggedIn = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const handleLogout = () => appDispatch({ type: "logout" });

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
        className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        className="mr-2 header-chat-icon text-white"
        data-for="chat"
        data-tip="Chat">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        data-for="profile"
        data-tip="Profile"
        to={`/profile/${appState.user.username}`}
        className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
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