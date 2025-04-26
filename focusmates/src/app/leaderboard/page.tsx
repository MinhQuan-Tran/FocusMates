'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ref, onValue } from "firebase/database";
import { rtdb } from '@/firebase'; // Your firebase.js config


export default function LeaderboardsPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const usersRef = ref(rtdb, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedData = Object.entries(data).map(([_, userInfo]) => ({
          name: userInfo.username,
          skill: userInfo.skills.join(', '),
          sessions: userInfo.numberOfSessions,
        }));

        // Optional: sort by sessions descending
        parsedData.sort((a, b) => b.sessions - a.sessions);

        setLeaderboardData(parsedData);
      }
    });
  }, []);

  return (
    <div className="bg-focusmate w-full h-screen flex flex-col items-center justify-center px-4">
    <main className="max-w-3xl w-full text-center space-y-8 overflow-y-auto h-[90vh] p-4">


        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          🏆 Top <span className="text-primary">FocusMates</span> of the Week
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base">
          Celebrate the most consistent study warriors! 📚
        </p>

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
