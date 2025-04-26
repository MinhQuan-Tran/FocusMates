'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { rtdb } from '@/firebase';

export default function MatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedId = searchParams.get('matched');

  const [matchedUser, setMatchedUser] = useState<any>(null);

  useEffect(() => {
    if (!matchedId) return;

    const fetchMatchedUser = async () => {
      try {
        const userRef = ref(rtdb, `users/${matchedId}`);
        const skillRef = ref(rtdb, `matchingRequests/${matchedId}`);

        const [userSnap, skillSnap] = await Promise.all([
          get(userRef),
          get(skillRef)
        ]);

        if (userSnap.exists() && skillSnap.exists()) {
          const userInfo = userSnap.val();
          const skillInfo = skillSnap.val();
          setMatchedUser({
            name: userInfo.name,
            degree: userInfo.degree,
            skill: skillInfo.lookingForSkill,
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchMatchedUser();

    const timeout = setTimeout(() => {
      router.push(`/session/${matchedId}`);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [matchedId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-xl text-center space-y-6 border border-emerald-100">
        <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
          🤝 You've Been Matched!
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Say hello to your new FocusMate 🎉
        </p>

        {matchedUser ? (
          <div className="text-gray-700 text-lg space-y-2">
            <p><strong>Name:</strong> {matchedUser.name}</p>
            <p><strong>Degree:</strong> {matchedUser.degree}</p>
            <p><strong>Skill:</strong> {matchedUser.skill}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading match info...</p>
        )}

        <p className="text-sm text-gray-400">Redirecting you to the session in a moment...</p>
      </div>
    </div>
  );
}
