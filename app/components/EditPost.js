import React, { useEffect, useState, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { useParams, Link, useHistory } from "react-router-dom";
import Axios from "axios";

import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

const reducer = (draft, action) => {
  switch (action.type) {
    case "fetchComplete":
      draft.title.value = action.value.title;
      draft.body.value = action.value.body;
      draft.isfetching = false;
      return;
    case "titleChange":
      draft.title.value = action.value;
      draft.title.hasErrors = false;
      return;
    case "bodyChange":
      draft.body.value = action.value;
      draft.body.hasErrors = false;
      return;
    case "submitRequest":
      if (!draft.title.hasErrors && !draft.body.hasErrors) draft.sendCount++;
      return;
    case "saveRequestStarted":
      draft.isSaving = true;
      return;
    case "saveRequestFinished":
      draft.isSaving = false;
      return;
    case "titleRules":
      if (!action.value.trim()) {
        draft.title.hasErrors = true;
        draft.title.message = "You must provide a title.";
      }
      return;
    case "bodyRules":
      if (!action.value.trim()) {
        draft.body.hasErrors = true;
        draft.body.message = "You must provide a post text.";
      }
      return;
    case "notFound":
      draft.notFound = true;
      return;
  }
};

const EditPost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const history = useHistory();

  const INITIAL_STATE = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isfetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  };

  const [state, dispatch] = useImmerReducer(reducer, INITIAL_STATE);

  const submitHandler = async e => {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitRequest" });
  };

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          canceltoken: ourRequest.token
        });

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });

          if (appState.user.username !== response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You do not have permission to edit this post",
              warning: true
            });
            //redirect to homepage
            history.push("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchPost();

    return () => ourRequest.cancel();
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });

      const ourRequest = Axios.CancelToken.source();

      const updatePost = async () => {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token
            },
            {
              canceltoken: ourRequest.token
            }
          );
          console.log(response.data);
          dispatch({ type: "saveRequestFinished" });
          appDispatch({ type: "flashMessage", value: "Post updated!" });
          // if (response.data === "success")
          history.push(`/post/${state.id}`);
        } catch (error) {
          console.log(error.response);
        }
      };

      updatePost();

      return () => ourRequest.cancel();
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title="Edit post">
      <Link to={`/post/${state.id}`} className="small font-weight-bold">
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            onBlur={e =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={state.title.value}
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
          />
          {state.title.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
          />
          {state.body.hasErrors && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button disabled={state.isSaving} className="btn btn-primary">
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default EditPost;
