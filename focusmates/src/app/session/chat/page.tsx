'use client';

import React, { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'You', text: 'Hey there! Ready to study?' },
    { id: 2, sender: 'Partner', text: 'Yep, let’s do this 🔥' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: input.trim() }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-md h-[400px] flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-transparent">
      {/* Chat log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
              msg.sender === 'You'
                ? 'ml-auto bg-primary text-white'
                : 'mr-auto bg-gray-200 text-gray-900'
            }`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex border-t border-gray-200 p-2 bg-white/80 backdrop-blur-md">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-emerald-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
