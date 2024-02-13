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
    if (!hasName) {
      const enteredName = prompt("Please enter your name:") || "";
      if (enteredName.trim() !== "") {
        setName(enteredName);
        setHasName(true);
        socket.emit("join", enteredName); // Emit "join" event with username
      } else {
        alert("Name cannot be empty.");
      }
    }
  }, [hasName]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (name.trim() !== "" && inputValue.trim() !== "") {
      socket.emit("chat message", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
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
