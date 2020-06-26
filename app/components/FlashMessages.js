import React from "react";

const FlashMessages = ({ messages }) => {
  return (
    <div className="floating-alerts">
      {messages.map((message, index) => (
        <div
          key={index}
          className={
            "alert text-center floating-alert shadow-sm " +
            (message.warning ? "alert-danger" : "alert-success")
          }>
          {message.msg}
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
