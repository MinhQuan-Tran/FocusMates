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
    }, 2000);

    return () => clearTimeout(timeout);
  }, [matchedId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-4">🔍 Finding your FocusMate...</h1>
        {matchedUser ? (
          <div className="text-lg text-gray-700 space-y-1">
            <p><strong>Name:</strong> {matchedUser.name}</p>
            <p><strong>Degree:</strong> {matchedUser.degree}</p>
            <p><strong>Skill:</strong> {matchedUser.skill}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading match info...</p>
        )}
        <p className="mt-4 text-gray-400 text-sm">Redirecting you shortly...</p>
      </div>
    </div>
  );
}
