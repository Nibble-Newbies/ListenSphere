// ChatApp.js
import React, { useState } from 'react';
import ChatWindow from './components/chatwindow';
import MessageInput from './components/messageInput';
import './index.css'
const ChatApp = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (text, sender) => {
    const newMessage = { text, sender, timestamp: new Date() };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-app">
      <ChatWindow messages={messages} />
      <MessageInput onMessageSend={addMessage} />
    </div>
  );
};

export default ChatApp;
