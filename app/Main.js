import React, { useState, useContext, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import NotFound from "./components/NotFound";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";

const reducer = (draft, action) => {
  switch (action.type) {
    case "login":
      draft.loggedIn = true;
      draft.user = action.data;
      return;
    case "logout":
      draft.loggedIn = false;
      return;
    case "flashMessage":
      draft.flashMessages.push(action.value);
      return;
  }
};

const INITIAL_STATE = {
  loggedIn: Boolean(localStorage.getItem("complexAppToken")),
  flashMessages: [],
  user: {
    token: localStorage.getItem("complexAppToken"),
    username: localStorage.getItem("complexAppUsername"),
    avatar: localStorage.getItem("complexAppAvatar")
  }
};

const Main = () => {
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexAppToken", state.user.token);
      localStorage.setItem("complexAppUsername", state.user.username);
      localStorage.setItem("complexAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexAppToken");
      localStorage.removeItem("complexAppUsername");
      localStorage.removeItem("complexAppAvatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>

            <Route exact path="/">
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>

            <Route exact path="/post/:id">
              <ViewSinglePost />
            </Route>

            <Route exact path="/post/:id/edit">
              <EditPost />
            </Route>

            <Route path="/create-post">
              <CreatePost />
            </Route>

            <Route path="/about-us">
              <About />
            </Route>

            <Route path="/terms">
              <Terms />
            </Route>

            <Route>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

ReactDOM.render(<Main />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
