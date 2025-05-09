import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  degree?: string;
  skills?: string[];
  streak?: number;
  points?: number;
}

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

export interface TimerBoxProps {
  totalDuration: number;
  timeLeft: number;
  isFocus: boolean;
}
