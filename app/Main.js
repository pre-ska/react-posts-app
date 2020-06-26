import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://posts-app-express.herokuapp.com";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import ViewSinglePost from "./components/ViewSinglePost";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import FlashMessages from "./components/FlashMessages";
import LoadingDotsIcon from "./components/LoadingDotsIcon";

const CreatePost = React.lazy(() => import("./components/CreatePost"));
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

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
    case "openSearch":
      draft.isSearchOpen = true;
      return;
    case "closeSearch":
      draft.isSearchOpen = false;
      return;
    case "toggleChat":
      draft.isChatOpen = !draft.isChatOpen;
      return;
    case "closeChat":
      draft.isChatOpen = false;
      return;
    case "incrementNotifications":
      draft.unreadChatCount++;
      return;
    case "resetNotifications":
      draft.unreadChatCount = 0;
      return;
  }
};

const INITIAL_STATE = {
  loggedIn: Boolean(localStorage.getItem("postsAppToken")),
  flashMessages: [],
  user: {
    token: localStorage.getItem("postsAppToken"),
    username: localStorage.getItem("postsAppUsername"),
    avatar: localStorage.getItem("postsAppAvatar")
  },
  isSearchOpen: false,
  isChatOpen: false,
  unreadChatCount: 0
};

const Main = () => {
  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("postsAppToken", state.user.token);
      localStorage.setItem("postsAppUsername", state.user.username);
      localStorage.setItem("postsAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("postsAppToken");
      localStorage.removeItem("postsAppUsername");
      localStorage.removeItem("postsAppAvatar");
    }
  }, [state.loggedIn]);

  // provjera dali je token istekao na prvom renderu
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();

      const fetchResults = async () => {
        try {
          const response = await Axios.post(
            "/checkToken",
            {
              token: state.user.token
            },
            {
              cancelToken: ourRequest.token
            }
          );

          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your session has expired. Please log in again."
            });
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchResults();

      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />

          <Header />

          <Suspense fallback={<LoadingDotsIcon />}>
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
          </Suspense>

          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>

          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>

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
