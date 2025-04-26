'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { rtdb } from '@/firebase';

type MatchedUser = {
  name: string;
  degree: string;
  skill: string;
};

export default function MatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedId = searchParams.get('matched');

  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);

  useEffect(() => {
    if (!matchedId) return;

    const fetchMatchedUser = async () => {
      try {
        const userRef = ref(rtdb, `users/${matchedId}`);
        const skillRef = ref(rtdb, `matchingRequests/${matchedId}`);

        const [userSnap, skillSnap] = await Promise.all([
          get(userRef),
          get(skillRef),
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
    }, 2000);

    return () => clearTimeout(timeout);
  }, [matchedId, router]);

  return (
    <div className=" bg-focusmate min-h-screen flex items-center justify-center bg-[#fdfbf7] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-primary text-3xl font-bold text-[#1e1e1e] mb-2">
          🤝 FocusMate Match Found!
        </h1>
        <p className="text-gray-500 mb-6">Say hi and start your session 👋</p>

        {matchedUser ? (
          <div className="space-y-3 text-lg">
            <p>
              <span className="font-semibold text-[#444]">Name:</span> {matchedUser.name}
            </p>
            <p>
              <span className="font-semibold text-[#444]">Degree:</span> {matchedUser.degree}
            </p>
            <p>
              <span className="font-semibold text-[#444]">Skill:</span> {matchedUser.skill}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-base">Loading match info...</p>
        )}

        <p className="mt-6 text-sm text-gray-400">Redirecting you shortly...</p>
      </div>
    </div>
  );
}
