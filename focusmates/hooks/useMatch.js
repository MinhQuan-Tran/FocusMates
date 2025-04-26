// hooks/useMatch.js
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection, query, where, getDocs, addDoc, serverTimestamp
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function useMatch() {
  const [user] = useAuthState(auth);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  const findMatches = async () => {
    if (!user) return;
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
  };

  const sendInvite = async (otherUid) => {
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

  return { candidates, findMatches, sendInvite, error };
}
