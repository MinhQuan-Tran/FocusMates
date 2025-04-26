"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { db } from "@/firebase"; // Your Firestore configuration
import { useAuth } from "@/context/AuthContext"; // Import AuthContext
import { User } from "@/types"; // Import your User type

export default function LeaderboardsPage() {
  const { currentUser, loading } = useAuth(); // Access currentUser and loading from AuthContext
  const [leaderboardData, setLeaderboardData] = useState<
    { name: string | null; skill: string | undefined; sessions: number }[]
  >([]);

  useEffect(() => {
    if (!loading && !currentUser) {
      // Redirect to login if the user is not authenticated
      window.location.href = "/login";
      return;
    }

    const fetchLeaderboardData = async () => {
      try {
        const usersCollection = collection(db, "users"); // Reference to the Firestore "users" collection
        const querySnapshot = await getDocs(usersCollection);

        const parsedData = querySnapshot.docs.map((doc) => {
          const user = doc.data() as User;
          return {
            name: user.displayName || user.email, // Use displayName if available, otherwise fallback to email
            skill: user.skills?.join(", "),
            sessions: user.streak || 0 // Default to 0 if streak is not available
          };
        });

        // Optional: sort by sessions descending
        parsedData.sort((a, b) => b.sessions - a.sessions);

        setLeaderboardData(parsedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, [currentUser, loading]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or placeholder while loading
  }

  return (
    <div className="bg-focusmate w-full h-screen flex flex-col items-center justify-center px-4">
      <main className="max-w-3xl w-full text-center space-y-8 overflow-y-auto h-[90vh] p-4">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          🏆 Top <span className="text-primary">FocusMates</span> of the Week
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base">Celebrate the most consistent study warriors! 📚</p>

        {/* Leaderboard Table */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden mt-6">
          <table className="min-w-full text-left">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Skill</th>
                <th className="px-6 py-3">Sessions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {leaderboardData.map((user, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="px-6 py-4 font-semibold">{index + 1}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.skill}</td>
                  <td className="px-6 py-4">{user.sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back to home link */}
        <Link
          href="/"
          className="float-right mt-8 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition"
        >
          ⬅️Back to Home
        </Link>
      </main>
    </div>
  );
}
