'use client';

import React from 'react';
import MatchCard from '@/components/MatchCard'; // assuming you already have MatchCard
import Link from 'next/link';

export default function ProfilePage() {
  const userInfo = {
    name: "John Doe",
    degree: "Bachelor of Computer Science",
    university: "University of GenAI",
    skills: ["Python", "Machine Learning", "React", "Data Analysis"],
  };

  const sessionHistory = [
    { partner: "Alice", topic: "Python Practice", date: "2024-05-01" },
    { partner: "Bob", topic: "Next.js Deep Dive", date: "2024-05-03" },
    { partner: "Charlie", topic: "Firebase", date: "2024-05-05" },
  ];

  return (
    <main className="bg-focusmate min-h-screen w-full p-6 flex flex-col items-center">
      {/* Profile Section */}
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary">{userInfo.name}</h1>
        <p className="text-gray-600">{userInfo.degree} @ {userInfo.university}</p>
    

        <div className="flex flex-wrap gap-2 mt-2">
          {userInfo.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Sessions Section */}
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">📚 Your Recent Sessions</h2>

        <div className="flex flex-col gap-4">
          {sessionHistory.map((session, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-md flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold">{session.topic}</p>
                <p className="text-gray-500">with {session.partner}</p>
              </div>
              <p className="text-sm text-gray-400 mt-2 sm:mt-0">{session.date}</p>
            </div>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition"
          >
            ⬅️ Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
