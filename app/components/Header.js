import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import HeaderLoggedout from "./HeaderLoggedout";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../StateContext";

const Header = ({ staticEmpty }) => {
  const appState = useContext(StateContext);

  const headerContent = appState.loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedout />
  );

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            Posts App!
          </Link>
        </h4>
        {!staticEmpty ? headerContent : ""}
      </div>
    </header>
  );
};

export default Header;
