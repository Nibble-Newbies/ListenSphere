// ChatApp.js
import React, { useEffect, useState } from "react";
import ChatWindow from "./components/chatwindow";
import MessageInput from "./components/messageInput";
import "./index.css";
import socket from "./socket";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);

  // useEffect to set up event listeners only once
  useEffect(() => {
    // Receive messages
    socket.on("receive-message", (text) => {
      // Handle received messages as needed
      setMessages((prevMessages) => [
        ...prevMessages,
        { text:text.text, sender: "other", timestamp: new Date() },
      ]);
    });

    // Clean up the event listeners when the component is unmounted
    return () => {
      socket.off("receive-message");
    };
  }, []); // Empty dependency array ensures the effect runs only once

  // Send message function
  const sendMessage = (text) => {
    socket.emit("send-message", text);
  };

  const addMessage = (text, sender) => {
    const newMessage = { text, sender, timestamp: new Date() };
    sendMessage(newMessage);
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
