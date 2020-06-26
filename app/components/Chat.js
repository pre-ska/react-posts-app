import React, { useContext, useRef, useEffect } from "react";
import { useImmer } from "use-immer";
import io from "socket.io-client";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { Link } from "react-router-dom";

const Chat = () => {
  const socket = useRef()
  const chatField = useRef(null);
  const chatLog = useRef(null);

  const { isChatOpen, user } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: []
  });

  useEffect(() => {
    if (isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "resetNotifications" });
    }
  }, [isChatOpen]);

  useEffect(() => {
    socket.current = io("http://localhost:8080");

    socket.current.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });

    return () => socketcurrent..disconnect()
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !isChatOpen) {
      appDispatch({ type: "incrementNotifications" });
    }
  }, [state.chatMessages]);

  const handleFieldchange = e => {
    const value = e.target.value;
    setState(draft => {
      draft.fieldValue = value;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    socket.current.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: user.token
    });

    setState(draft => {
      // add msg to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar
      });
      draft.fieldValue = "";
    });
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (isChatOpen ? "chat-wrapper--is-visible" : "")
      }>
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: "closeChat" })}
          className="chat-title-bar-close">
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div ref={chatLog} id="chat" className="chat-log">
        {state.chatMessages.map((message, index) => {
          if (message.username === user.username) {
            return (
              <div key={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>

                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top">
        <input
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          value={state.fieldValue}
          onChange={handleFieldchange}
        />
      </form>
    </div>
  );
};

export default Chat;
