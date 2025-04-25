import { Timestamp } from "firebase/firestore";

export interface SessionData {
  matchId: string;
  startTime: Timestamp;
  duration: number;
  breakDuration: number;
  chat: ChatMessage[];
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
}

export interface ChatBoxProps {
  chat: ChatMessage[];
  currentUserId: string;
  onSend: (msg: string) => void;
}
