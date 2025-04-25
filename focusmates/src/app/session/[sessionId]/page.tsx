"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import { rtdb } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import TimerBox from "@/components/TimerBox";
import ChatBox from "@/components/ChatBox";
import VideoBox from "@/components/VideoBox";
import { SessionData, ChatMessage } from "@/types";

export default function SessionPage() {
  const { sessionId } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(true);

  useEffect(() => {
    if (!sessionId) return; // Handle the case where sessionId is not available

    const mockSession: SessionData = {
      matchId: "mock-match-001",
      startTime: Timestamp.now(),
      duration: 1, // minutes
      breakDuration: 1,
      chat: []
    };

    setSessionData(mockSession);
    setTimeLeft(mockSession.duration * 60);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionData) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const switchingToFocus = !isFocus;
          setIsFocus(switchingToFocus);
          return (switchingToFocus ? sessionData.duration : sessionData.breakDuration) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocus, sessionData]);

  useEffect(() => {
    if (!sessionId || typeof sessionId !== "string") return;

    const chatRef = ref(rtdb, `sessions/${sessionId}/chat`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return setChat([]);
      const chatArray: ChatMessage[] = Object.values(data);
      setChat(chatArray);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !sessionId || typeof sessionId !== "string" || !currentUser) return;

    const chatRef = ref(rtdb, `sessions/${sessionId}/chat`);
    await push(chatRef, {
      sender: currentUser.uid,
      message: newMessage.trim(),
      timestamp: serverTimestamp()
    });
  };

  if (!sessionId) return null;

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100">
        <VideoBox sessionId={sessionId as string} userName={currentUser.displayName} />
      </div>
      {/* Right side - Timer + Chat */}
      <div className="w-[400px] flex flex-col p-4 gap-4">
        {/* Timer on top */}
        <TimerBox totalDuration={sessionData?.duration || 0} timeLeft={timeLeft} isFocus={isFocus} />

        {/* Chat fills remaining space */}
        <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
      </div>
    </div>
  );
}
