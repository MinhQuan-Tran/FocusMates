"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10 font-sans">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Welcome, {currentUser.name} 👋
      </h1>
      <p className="text-sm text-gray-600 mb-4">{currentUser.email} — {currentUser.degree}</p>

      <div className="flex items-center gap-6 mt-4 mb-6">
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
          🔥 Streak: {currentUser.streak} days
        </div>
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium">
          🪙 Points: {currentUser.points}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Skills</h2>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.push("/matchcard")}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          🎯 Find a Study Match
        </button>
        <button
          onClick={() => router.push("/session/demo")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          ⏱ Start Session
        </button>
      </div>
    </div>
  );
}