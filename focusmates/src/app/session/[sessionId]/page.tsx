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
import { MessageSquare } from "lucide-react";

export default function SessionPage() {
  const { sessionId } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const mockSession: SessionData = {
      matchId: "mock-match-001",
      startTime: Timestamp.now(),
      duration: 1,
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
          const switching = !isFocus;
          setIsFocus(switching);
          return (switching ? sessionData.duration : sessionData.breakDuration) * 60;
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
    <div className=" w-full min-h-screen relative flex flex-col md:flex-row ">
      {/* Video Section */}
      <div className=" w-full h-screen md:h-auto md:flex-1 bg-transparent p-4">
        <VideoBox sessionId={sessionId as string} userName={currentUser.displayName} />
      </div>


      {/* Right Panel for desktop */}
      <div className=" hidden md:flex w-[400px] flex-col p-4 gap-4 bg-transparent">
        <TimerBox totalDuration={sessionData?.duration || 0} timeLeft={timeLeft} isFocus={isFocus} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
      </div>

      </div>

      {/* Mobile floating TimerBox and Chat button */}
      <div className="md:hidden absolute top-4 right-4 flex flex-col gap-2 items-end z-50">
        {/* TimerBox Popup - Mobile Small */}
        <div className="bg-white shadow-lg rounded-full p-2 w-24 h-24 flex items-center justify-center">
          <TimerBox
            totalDuration={sessionData?.duration || 0}
            timeLeft={timeLeft}
            isFocus={isFocus}
            small // <-- Add small to shrink it
          />
        </div>

        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="bg-white shadow-lg rounded-full p-2"
        >
          <MessageSquare size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Mobile Chat Modal */}
      {isChatOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg p-4">
            <button
              onClick={() => setIsChatOpen(false)}
              className="ml-auto mb-2 text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
            <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
}
