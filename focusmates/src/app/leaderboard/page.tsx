'use client';

import React from 'react';
import Link from 'next/link';

export default function LeaderboardsPage() {
  const leaderboardData = [
    { name: 'Alice', skill: 'Python, Math', sessions: 15 },
    { name: 'Bob', skill: 'Marketing, Design', sessions: 12 },
    { name: 'Charlie', skill: 'Math', sessions: 10 },
    { name: 'David', skill: 'React', sessions: 8 },
    { name: 'Eve', skill: 'Design', sessions: 6 },
  ];

  return (
    <div className="bg-focusmate w-full min-h-screen flex flex-col items-center justify-center px-4">
      <main className="max-w-3xl w-full text-center space-y-8">

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
          className="inline-block mt-8 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition"
        >
          ⬅️Back to Home
        </Link>
      </main>
    </div>
  );
}
