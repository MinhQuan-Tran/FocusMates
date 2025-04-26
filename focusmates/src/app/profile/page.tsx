'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ref, onValue, get } from 'firebase/database';
import { rtdb } from '@/firebase';

type PartnerInfo = {
  name: string;
  degree?: string;
  university?: string;
};

type Session = {
  partnerId: string;
  partnerSkills: string[];
  date: string;
  topic?: string;
  partnerInfo?: PartnerInfo; // Add full partner info
};

type UserProfile = {
  name: string;
  degree?: string;
  university?: string;
  skills: string[];
  sessionHistory?: Session[];
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [sessionsWithPartners, setSessionsWithPartners] = useState<Session[]>([]);
  const userId = 'user001'; // Replace with auth user ID if needed

  useEffect(() => {
    const userRef = ref(rtdb, `users/${userId}`);
    onValue(userRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const baseUserInfo: UserProfile = {
          name: data.name,
          degree: data.degree,
          university: data.university,
          skills: data.skills || [],
          sessionHistory: data.sessionHistory || [],
        };

        setUserInfo(baseUserInfo);

        // Fetch full partner info dynamically
        const updatedSessions = await Promise.all(
          (baseUserInfo.sessionHistory || []).map(async (session) => {
            if (!session.partnerId) return session;

            try {
              const partnerRef = ref(rtdb, `users/${session.partnerId}`);
              const partnerSnap = await get(partnerRef);
              const partnerData = partnerSnap.val();

              return {
                ...session,
                partnerInfo: partnerData
                  ? {
                      name: partnerData.name,
                      degree: partnerData.degree,
                      university: partnerData.university,
                    }
                  : { name: session.partnerId },
              };
            } catch (error) {
              console.error('Error fetching partner info:', error);
              return {
                ...session,
                partnerInfo: { name: session.partnerId },
              };
            }
          })
        );

        setSessionsWithPartners(updatedSessions);
      }
    });
  }, []);

  if (!userInfo) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <main className="bg-focusmate h-screen w-full overflow-y-auto p-6 flex flex-col items-center">

      {/* Profile Section */}
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary">{userInfo.name}</h1>
        {userInfo.degree && userInfo.university && (
          <p className="text-gray-600">
            {userInfo.degree} @ {userInfo.university}
          </p>
        )}
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
          {sessionsWithPartners.map((session, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-lg p-4 shadow-md flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold">{session.topic ?? 'Study Session'}</p>

                {/* Partner Name */}
                <p className="text-gray-500">
                  with {session.partnerInfo?.name || session.partnerId}
                </p>

                {/* Partner Degree + University */}
                {session.partnerInfo?.degree && session.partnerInfo?.university && (
                  <p className="text-gray-400 text-sm">
                    {session.partnerInfo.degree} @ {session.partnerInfo.university}
                  </p>
                )}

                {/* Partner Skills */}
                {session.partnerSkills && (
                  <div className="flex flex-wrap gap-2 mt-1 justify-center sm:justify-start">
                    {session.partnerSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Session Date */}
              <p className="text-sm text-gray-400 mt-2 sm:mt-0">{session.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Back Button */}
      <Link
        href="/"
        className="fixed bottom-6 right-6 bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition z-50 shadow-md"
      >
        ⬅️Back to Home
      </Link>
    </main>
  );
}
