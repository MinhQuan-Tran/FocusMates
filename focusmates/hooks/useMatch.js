// hooks/useMatch.js
import { useState, useEffect } from "react";
//import { onAuthStateChanged }  from "firebase/auth";
import {
  collection, query, where,
  getDocs, addDoc, serverTimestamp
} from "firebase/firestore";
//import { auth, db } from "../lib/firebase";

export default function useMatch() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);


/*
  // 1) auth listener 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  */

  // 1) Hardcoded mock user for local testing
  useEffect(() => {
    setUser({
      uid: "mock-user-123",
      skills: ["Python", "AI"],
    });
  }, []);
  

  // 2) find matches 
  const findMatches = async () => {
    if (!user) return;
    try {
      const meSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", user.uid))
      );
      const me = meSnap.docs[0]?.data() || { skills: [] };
      const q = query(
        collection(db, "users"),
        where("skills", "array-contains-any", me.skills),
        where("uid", "!=", user.uid)
      );
      const snap = await getDocs(q);
      setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setError(e);
    }
  };

  // 3) send invite
  const sendInvite = async (otherUid) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "matches"), {
        user1: user.uid,
        user2: otherUid,
        status: "pending",
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      setError(e);
    }
  };

  return { user, candidates, findMatches, sendInvite, error };
}
