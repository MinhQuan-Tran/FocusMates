'use client';

import React, { useEffect, useState } from 'react';

const FULL_DASH_ARRAY = 283;

export default function Timer() {
  const [isFocus, setIsFocus] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 min
  const [sessions, setSessions] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (isFocus) {
            setIsFocus(false);
            return 300; // switch to 5 min break
          } else {
            setIsFocus(true);
            setSessions((s) => s + 1);
            return 1500; // back to focus 25 min = 1500 sec
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocus]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const dashOffset = FULL_DASH_ARRAY - (FULL_DASH_ARRAY * timeLeft) / (isFocus ? 1500 : 300);

  return (
    <div className="max-w-sm bg-white shadow-xl w-full p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium capitalize">{isFocus ? '🎯 Focus time' : '☕ Break time'}</h2>
        <div className="text-sm text-gray-500">Sessions: {sessions}</div>
      </div>

      <div className="relative flex items-center justify-center w-40 h-40 mx-auto mb-6">
        <svg className="absolute w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeDasharray={FULL_DASH_ARRAY}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={`${isFocus ? 'text-primary' : 'text-blue-400'} transition-all duration-100 linear`}
          />
        </svg>
        <div className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
      </div>

      <button className="w-full bg-softYellow text-dark hover:bg-softYellowHover py-2 rounded-lg font-medium transition-colors duration-300">
        Leave Session
      </button>

    </div>
  );
}
