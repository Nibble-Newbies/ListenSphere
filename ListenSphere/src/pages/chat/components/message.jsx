// Message.js
import React from 'react';

const Message = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <p>{message.text}</p>
      <span className="timestamp">{message.timestamp.toLocaleString()}</span>
    </div>
  );
};

export default Message;
