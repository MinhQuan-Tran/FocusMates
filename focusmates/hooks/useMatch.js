// hooks/useMatch.js
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function useMatch() {
  const [user, setUser] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [bestMatch, setBestMatch] = useState(null);
  const [balancedMatch, setBalancedMatch] = useState(null);
  const [error, setError] = useState(null);

  // 1) Mocked user for local testing (with streak and points)
  useEffect(() => {
    setUser({
      uid: "mock-user-123",
      skills: ["Python", "AI"],
      streak: 5,
      points: 120
    });
  }, []);

  // 2) Find matches and compute metrics
  const findMatches = async () => {
    if (!user) return;
    try {
      const { skills: mySkills, streak: myStreak } = user;

      // Query candidates who share any of my skills
      const q = query(
        collection(db, "users"),
        where("skills", "array-contains-any", mySkills),
        where("uid", "!=", user.uid)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Enrich with compatibility ratio and points calculation
      const enriched = docs.map(u => {
        const intersection = u.skills.filter(s => mySkills.includes(s)).length;
        const union = new Set([...u.skills, ...mySkills]).size;
        const compatibility = union > 0 ? intersection / union : 0;
        const availablePoints = myStreak * (u.streak || 0);
        const combinedScore = compatibility * availablePoints;
        return { ...u, compatibility, availablePoints, combinedScore };
      });

      // Update candidates list
      setCandidates(enriched);

      // Suggestion 1: Highest compatibility
      setBestMatch(
        enriched.length
          ? enriched.reduce((a, b) => (b.compatibility > a.compatibility ? b : a))
          : null
      );

      // Suggestion 2: Balance of compatibility and available points
      setBalancedMatch(
        enriched.length
          ? enriched.reduce((a, b) => (b.combinedScore > a.combinedScore ? b : a))
          : null
      );
    } catch (e) {
      setError(e);
    }
  };

  // 3) Send invite to selected user
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

  return {
    user,
    candidates,
    bestMatch,
    balancedMatch,
    findMatches,
    sendInvite,
    error
  };
}
