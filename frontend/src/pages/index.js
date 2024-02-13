import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";

const socket = io("http://localhost:3001");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    localStorage.removeItem("chatUserName"); // Clear stored name on component mount

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    if (!hasName) {
      const storedName = localStorage.getItem("chatUserName");
      if (storedName) {
        setName(storedName);
        setHasName(true);
        socket.emit("join", storedName); // Emit "join" event with stored username
      }
    }
  }, [hasName]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      localStorage.setItem("chatUserName", name.trim());
      setHasName(true);
      socket.emit("join", name.trim()); // Emit "join" event with entered username
    } else {
      alert("Name cannot be empty.");
    }
  };

  const sendMessage = () => {
    if (name.trim() !== "" && inputValue.trim() !== "") {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {!hasName && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <form onSubmit={handleNameSubmit} className="flex flex-col items-center">
              <label htmlFor="name" className="block mb-2">
                Please enter your name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring focus:border-blue-300 mb-2"
                placeholder="Your name..."
              />
              <button
                type="submit"
                className="py-2 px-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                Start Chatting
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          {messages.map((message, index) => (
            <div key={index} className="p-2 rounded-lg bg-white shadow-md">
              {message}
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex items-center space-x-4 px-4 py-2 bg-gray-200">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 py-2 px-4 bg-white rounded-full focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type a message..."
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          className="py-2 px-4 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
}

export default Chat;
