// Message.js
import React from "react";

const Message = ({ message }) => {
  
  console.log(message);
  return (
    <>
      {message?.sender === "other" ? (
        <div className={`message ${message.sender}`}>
          <p>{message.text}</p>
          <span className="timestamp">
            {message.timestamp.toLocaleString()}
          </span>
        </div>
      ) : (
        <div className={`message ${message.sender}`}>
        <p>{message.text}</p>
        <span className="timestamp">
          {message.timestamp.toLocaleString()}
        </span>
      </div>
      )}
    </>
  );
};

export default Message;
