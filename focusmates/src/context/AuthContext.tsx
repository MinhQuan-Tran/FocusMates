import { createContext, useContext } from "react";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  name: string;
  degree: string;
  skills: string[];
  streak: number;
  points: number;
}

interface AuthContextType {
  currentUser: User;
}

const mockUser: User = {
  uid: "mock-user-123",
  email: "mockuser@example.com",
  displayName: "Alice",
  name: "Alice",
  degree: "CompSci",
  skills: ["Python", "AI"],
  streak: 3,
  points: 120
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: mockUser
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthContext.Provider value={{ currentUser: mockUser }}>{children}</AuthContext.Provider>;
};
