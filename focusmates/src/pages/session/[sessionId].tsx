import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import { rtdb } from "@/firebase";
import { AuthContext } from "@/context/AuthContext";
import ChatBox from "@/components/ChatBox";
import { SessionData, ChatMessage } from "@/types";

export default function SessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const { currentUser } = useContext(AuthContext);

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) return;

    const mockSession: SessionData = {
      matchId: "mock-match-001",
      startTime: Timestamp.now(),
      duration: 1,
      breakDuration: 1,
      chat: []
    };

    setSessionData(mockSession);
    setTimeLeft(mockSession.duration * 60);
  }, [currentUser]);

  useEffect(() => {
    if (!isRunning || !sessionData) return;

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
  }, [isRunning, isFocus, sessionData]);

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

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>Study Session</h1>

      {!sessionData ? (
        <p>Loading session...</p>
      ) : (
        <>
          <section style={{ margin: "2rem 0" }}>
            <h2>{isFocus ? "Focus Time" : "Break Time"}</h2>
            <p style={{ fontSize: "2rem", margin: "0.5rem 0" }}>
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </p>
            <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</button>
            {!isFocus && (
              <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                Time for a short break. Relax and reset before the next focus session.
              </p>
            )}
          </section>

          <ChatBox chat={chat} currentUserId={currentUser.uid} onSend={handleSendMessage} />
        </>
      )}
    </main>
  );
}
