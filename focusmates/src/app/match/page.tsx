"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, get, set, push, onValue, update, runTransaction } from "firebase/database";
import { useAuth } from "@/context/AuthContext";
import { rtdb } from "@/firebase";

export default function MatchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchContent />
    </Suspense>
  );
}

function MatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skills = searchParams?.get("skills");
  const { currentUser, loading } = useAuth();

  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (loading) return; // Wait for auth state to resolve

    if (!currentUser) {
      // Redirect to login if the user is not authenticated
      router.push(`/login?redirect=/match?skills=${encodeURIComponent(skills || "")}`);
      return;
    }

    if (!skills) {
      alert("No skills provided for matching.");
      router.push("/");
      return;
    }

    const handleMatching = async () => {
      try {
        const matchesRef = ref(rtdb, "matches");
        const snapshot = await get(matchesRef);

        if (snapshot.exists()) {
          const matches = snapshot.val();
          const matchEntries = Object.entries(matches) as [
            string,
            { users: string[]; skill: string; createdAt: string; status: string }
          ][];

          const matchEntry = matchEntries.find(
            ([, match]) =>
              match.skill.toLowerCase() === skills.trim().toLowerCase() &&
              match.status === "waiting" &&
              !match.users.includes(currentUser.uid)
          );

          if (matchEntry) {
            const [matchId, existingMatch] = matchEntry;

            const matchRef = ref(rtdb, `matches/${matchId}`);
            await update(matchRef, {
              users: [...existingMatch.users, currentUser.uid]
            });

            setIsWaiting(true);
            listenForSessionStart(matchId);
            return;
          }
        }

        const matchId = await createNewMatch();
        setIsWaiting(true);
        listenForParticipants(matchId);
      } catch (error) {
        console.error("Error during matching:", error);
        alert("Something went wrong. Please try again.");
        router.push("/");
      }
    };

    const createNewMatch = async () => {
      const matchesRef = ref(rtdb, "matches");

      // Use a transaction to ensure atomicity
      const newMatchRef = push(matchesRef); // Generate a new match reference
      const matchId = newMatchRef.key;

      await runTransaction(matchesRef, (matches) => {
        if (!matches) {
          matches = {};
        }

        // Check if a match already exists for the current user with the same skill
        const existingMatch = Object.entries(matches).find(
          ([, match]: [string, any]) =>
            match.skill.toLowerCase() === skills.trim().toLowerCase() &&
            match.status === "waiting" &&
            match.users.includes(currentUser.uid)
        );

        if (existingMatch) {
          // If a match already exists, return the existing match
          return matches; // No changes are made
        }

        // Add the new match to the matches object
        matches[matchId] = {
          users: [currentUser.uid],
          skill: skills.trim(),
          createdAt: new Date().toISOString(),
          status: "waiting" // Initial status is "waiting"
        };

        return matches; // Return the updated matches object
      });

      return matchId;
    };

    const listenForParticipants = (matchId: string) => {
      const matchRef = ref(rtdb, `matches/${matchId}`);
      onValue(matchRef, async (snapshot) => {
        if (snapshot.exists()) {
          const matchData = snapshot.val();
          const createdAt = new Date(matchData.createdAt).getTime();
          const now = Date.now();
          const elapsedMinutes = (now - createdAt) / (1000 * 1);

          if (elapsedMinutes >= 5 && matchData.users.length > 1 && matchData.status === "waiting") {
            const sessionId = `session_${Date.now()}`;
            const sessionRef = ref(rtdb, `sessions/${sessionId}`);
            await set(sessionRef, {
              users: matchData.users,
              skill: matchData.skill,
              matchId: matchId,
              serverStartTime: new Date().toISOString(),
              duration: 60,
              breakDuration: 10,
              chat: []
            });

            await update(matchRef, {
              status: "ongoing",
              sessionId: sessionId
            });

            router.push(`/session/${sessionId}`);
            return;
          }
        }
      });
    };

    const listenForSessionStart = (matchId: string) => {
      const matchRef = ref(rtdb, `matches/${matchId}`);
      onValue(matchRef, (snapshot) => {
        if (snapshot.exists()) {
          const matchData = snapshot.val();
          if (matchData.status === "ongoing") {
            const sessionId = matchData.sessionId;
            router.push(`/session/${sessionId}`);
          }
        }
      });
    };

    handleMatching();
  }, [currentUser, loading, skills, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isWaiting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-xl text-center space-y-6 border border-emerald-100">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
            ⏳ Waiting for a match...
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Hang tight! We&apos;re looking for someone with the same skill.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-xl text-center space-y-6 border border-emerald-100">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">🤝 Matching...</h1>
        <p className="text-gray-600 text-base sm:text-lg">Finding your perfect FocusMate 🎉</p>
      </div>
    </div>
  );
}
