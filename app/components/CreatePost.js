import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import Page from "./Page";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

const CreatePost = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const history = useHistory();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    const ourRequest = Axios.CancelToken.source();

    try {
      const response = await Axios.post(
        "/create-post",
        {
          title,
          body,
          token: appState.user.token
        },
        {
          canceltoken: ourRequest.token
        }
      );

      appDispatch({ type: "flashMessage", value: "Post succesfuly created!" });

      history.push(`/post/${response.data}`);
    } catch (error) {
      console.log(error.response.data);
    }
    return () => ourRequest.cancel();
  };

  return (
    <Page title="New post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={body}
            onChange={e => setBody(e.target.value)}></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;
