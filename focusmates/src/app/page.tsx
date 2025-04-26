'use client';

import { ref, get } from 'firebase/database';
import { rtdb } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Helper: Simple closest match function ---
  const findClosestSkill = (input: string, skills: string[]) => {
    let bestMatch = '';
    let smallestDistance = Infinity;

    for (const s of skills) {
      const distance = levenshteinDistance(input.toLowerCase(), s.toLowerCase());
      if (distance < smallestDistance) {
        bestMatch = s;
        smallestDistance = distance;
      }
    }
    return bestMatch;
  };

  // --- Helper: Levenshtein Distance ---
  const levenshteinDistance = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    return dp[a.length][b.length];
  };

  const handleMatch = async () => {
    if (!skill.trim()) return;

    setLoading(true);
    try {
      const matchingRef = ref(rtdb, 'matchingRequests');
      const snapshot = await get(matchingRef);

      if (snapshot.exists()) {
        const requests = snapshot.val();
        const requestEntries = Object.entries(requests) as [string, any][];

        // Sort oldest first
        const sortedRequests = requestEntries.sort(
          ([, a], [, b]) =>
            new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime()
        );

        // Try exact match first
        let matchEntry = sortedRequests.find(
          ([, request]) =>
            request.lookingForSkill.toLowerCase() === skill.trim().toLowerCase()
        );

        // If not found, try closest match
        if (!matchEntry) {
          const availableSkills = sortedRequests.map(([, req]) => req.lookingForSkill);
          const closestSkill = findClosestSkill(skill.trim(), availableSkills);

          matchEntry = sortedRequests.find(
            ([, request]) => request.lookingForSkill.toLowerCase() === closestSkill.toLowerCase()
          );
        }

        if (matchEntry) {
          const [matchedUserId] = matchEntry;
          router.push(`/match?matched=${matchedUserId}`);
        } else {
          alert('No FocusMate found with that skill yet!');
        }
      } else {
        alert('No matching requests available.');
      }
    } catch (error) {
      console.error('Error matching:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-focusmate w-full min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <main className="max-w-2xl w-full text-center space-y-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight">
          🏆 Write down your skill, Find your <span className="text-primary">FocusMates</span>!
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
          Find your perfect study buddy. Stay accountable. Level up together.
        </p>

        {/* Input and Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <input
          type="text"
          placeholder="e.g. Python, Marketing, Math..."
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              e.preventDefault(); // prevent accidental form submit
              handleMatch();
            }
          }}
          className="w-full sm:w-80 px-4 py-2 border rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
          <button
            onClick={handleMatch}
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Matching...' : 'Match'}
          </button>
        </div>

      </main>
    </div>
  );
}
