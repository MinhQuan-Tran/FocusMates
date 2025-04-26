"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ChatMessage, ChatBoxProps } from "@/types"; // Adjust import path if needed

export default function ChatBox({ chat, currentUserId, onSend }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const uids = Array.from(new Set(chat.map((msg) => msg.sender)));
    const fetchUserNames = async () => {
      const updates: Record<string, string> = {};
      await Promise.all(
        uids.map(async (uid) => {
          try {
            const userRef = doc(db, "users", uid);
            const snapshot = await getDoc(userRef);

            console.log("User snapshot:", snapshot.data()); // Debugging

            const displayName = snapshot.data()?.displayName;
            updates[uid] = displayName?.trim() || "Unknown User";
          } catch {
            updates[uid] = "Unknown User";
          }
        })
      );
      setUserMap(updates);
    };

    fetchUserNames();
  }, [chat]);

  const handleSubmit = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
  };

  const formatTime = (timestamp: ChatMessage["timestamp"]) => {
    if (!timestamp) return "";
    const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full max-w-md h-[400px] flex flex-col border border-gray-300 rounded-lg overflow-hidden bg-white shadow">
      {/* Chat log */}
      <div className="flex flex-col flex-1 p-4 overflow-y-auto gap-4 bg-white">
        {chat.map((msg, index) => {
          const isCurrentUser = msg.sender === currentUserId;
          return (
            <div
              key={index}
              className={`group flex flex-col max-w-[75%] ${
                isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <span className="text-xs text-gray-400 font-bold">{userMap[msg.sender] || "Unknown User"}</span>

              <div className="relative w-fit">
                {/* Message Bubble */}
                <div
                  className={`whitespace-pre-wrap break-words px-3 py-1 rounded-lg box-border min-w-[7ch] ${
                    isCurrentUser
                      ? "bg-emerald-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-900 rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>

                {/* Timestamp slide down on hover */}
                <span
                  className={`absolute top-[calc(100%)] text-xs text-gray-400 opacity-0 translate-y-[-2px] group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${
                    isCurrentUser ? "right-0" : "left-0"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div className="flex border-t border-gray-200 p-2 bg-white/80 backdrop-blur-md">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="flex-1 px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-800 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          onClick={handleSubmit}
          className="ml-2 px-4 py-2 bg-emerald-500 text-white text-sm rounded-full hover:bg-emerald-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
