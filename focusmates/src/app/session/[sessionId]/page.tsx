"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, get, push, onValue, serverTimestamp } from "firebase/database";
import { rtdb } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import TimerBox from "@/components/TimerBox";
import ChatBox from "@/components/ChatBox";
import VideoBox from "@/components/VideoBox";
import { SessionData, ChatMessage } from "@/types";
import { MessageSquare } from "lucide-react";

export default function SessionPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const { currentUser, loading } = useContext(AuthContext);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [matchData, setMatchData] = useState<any | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  // Fetch session data
  useEffect(() => {
    if (!sessionId) return;

    const sessionRef = ref(rtdb, `sessions/${sessionId}`);
    get(sessionRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSessionData(data);
        setTimeLeft(data.duration * 60); // Set initial time left
      } else {
        alert("Session not found.");
        router.push("/");
      }
    });
  }, [sessionId, router]);

  // Fetch match data and participants
  useEffect(() => {
    if (!sessionData?.matchId) return;

    const matchRef = ref(rtdb, `matches/${sessionData.matchId}`);
    get(matchRef).then((snapshot) => {
      if (snapshot.exists()) {
        const match = snapshot.val();
        setMatchData(match);

        // Fetch participant user info
        const userPromises = match.users.map(async (userId: string) => {
          const userRef = ref(rtdb, `users/${userId}`);
          const userSnapshot = await get(userRef);
          return userSnapshot.exists() ? userSnapshot.val() : null;
        });

        Promise.all(userPromises).then((users) => {
          setParticipants(users.filter((user) => user !== null)); // Filter out null values
        });
      }
    });
  }, [sessionData]);

  // Timer logic
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

  // Fetch chat messages
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

  // Handle sending chat messages
  const handleSendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || !sessionId || typeof sessionId !== "string" || !currentUser) return;

    const chatRef = ref(rtdb, `sessions/${sessionId}/chat`);
    await push(chatRef, {
      sender: currentUser.uid,
      message: newMessage.trim(),
      timestamp: serverTimestamp()
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder
  }

  if (!sessionId || !currentUser) return null;

  return (
    <div className="w-full h-full relative flex flex-col items-stretch md:flex-row gap-2 p-2">
      {/* Video Section */}
      <div className="w-full md:h-auto md:flex-1 bg-transparent">
        <VideoBox sessionId={sessionId as string} userName={currentUser.displayName || "User"} />
      </div>

      {/* Right Panel for desktop */}
      <div className="hidden md:flex w-[400px] flex-col items-stretch gap-2 bg-transparent">
        <TimerBox totalDuration={sessionData?.duration || 0} timeLeft={timeLeft} isFocus={isFocus} />
        <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
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
        <button onClick={() => setIsChatOpen((prev) => !prev)} className="bg-white shadow-lg rounded-full p-2">
          <MessageSquare size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Mobile Chat Modal */}
      {isChatOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg p-4">
            <button onClick={() => setIsChatOpen(false)} className="ml-auto mb-2 text-gray-500 hover:text-gray-800">
              Close
            </button>
            <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
}
