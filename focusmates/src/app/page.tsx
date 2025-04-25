'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [skill, setSkill] = useState('');

  return (
    <div className="bg-focusmate w-full min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <main className="max-w-2xl w-full text-center space-y-6">
        
        {/* 🔥 Golden ratio responsive heading */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
          🏆 Write down your skill, Find your <span className="text-primary">FocusMates</span>!
        </h1>

        {/* 🔥 Golden ratio responsive paragraph */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
          Find your perfect study buddy. Stay accountable. Level up together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="e.g. Python, Marketing, Math..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Link
            href="/session"
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition"
          >
            Match
          </Link>
        </div>
      </main>
    </div>
  );
}
