"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { auth, db } from "../firebase"; // Adjust the path to your Firebase configuration
import { User } from "@/types";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean; // Add loading state to the context
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true // Default loading state
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      console.log("Auth state changed:", user); // Debugging
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userData // Merge Firestore data with the current user
            });
          } else {
            console.warn("No user document found in Firestore for UID:", user.uid);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // Set loading to false after auth state is determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, loading }}>{children}</AuthContext.Provider>;
};
