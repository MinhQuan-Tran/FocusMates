import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ChatBoxProps, ChatMessage } from "@/types";

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
            const name = snapshot.data()?.name;
            updates[uid] = name?.trim() || "Unknown User";
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
    <section style={{ borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
      <h2>Chat</h2>
      <div
        id="chat-box"
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#fafafa",
          borderRadius: "0.5rem"
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              marginBottom: "0.8rem",
              padding: "0.5rem 0.75rem",
              backgroundColor: msg.sender === currentUserId ? "#2ecc71" : "#f1f1f1",
              borderRadius: msg.sender === currentUserId ? "0.5rem 0 0.5rem 0.5rem" : "0 0.5rem 0.5rem 0.5rem",
              float: msg.sender === currentUserId ? "right" : "left",
              width: "fit-content",
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem"
            }}
          >
            <strong>{userMap[msg.sender] || "Unknown User"}:</strong>
            <div
              style={{
                flexGrow: 1
              }}
            >
              {msg.message}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: "calc(-1 * (0.75rem + 0.25rem))", // 0.75rem for chat bubble + 0.25rem for extra space
                left: msg.sender === currentUserId ? "auto" : "0.5rem",
                right: msg.sender === currentUserId ? "0.5rem" : "auto",
                fontSize: "0.8rem",
                color: "#888",
                width: "8ch",
                textAlign: "right"
              }}
            >
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type your message..."
          rows={2}
          style={{ flexGrow: 1, padding: "0.5rem", resize: "none", borderRadius: "0.5rem 0 0 0.5rem" }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0 0.5rem 0.5rem 0",
            border: "0.8px solid rgb(118, 118, 118)",
            borderLeft: "none"
          }}
        >
          Send
        </button>
      </div>
    </section>
  );
}
