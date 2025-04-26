"use client";

import { TimerBoxProps } from "@/types";
import React from "react";
import Link from "next/link";

const FULL_DASH_ARRAY = 283;

export default function Timer({
  timeLeft,
  isFocus,
  totalDuration,
  small = false
}: TimerBoxProps & { small?: boolean }) {
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalInSeconds = totalDuration * 60;
  const percentDone = ((totalInSeconds - timeLeft) / totalInSeconds) * 100;
  const dashOffset = (FULL_DASH_ARRAY * percentDone) / 100;

  return (
    <div className={`${small ? "w-24" : "bg-white shadow-xl p-3 w-full rounded-lg"}`}>
      {/* Header */}
      {!small && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium capitalize">{isFocus ? "🎯 Focus time" : "☕ Break time"}</h2>
          <div className="text-sm text-gray-500">{totalDuration} min total</div>
        </div>
      )}

      {/* Circular Timer */}
      <div
        className={`relative flex items-center justify-center mx-auto mb-4 ${
          small ? "w-16 h-16" : "w-40 h-40"
        } overflow-hidden`}
      >
        <svg className={`absolute ${small ? "w-16 h-16" : "w-40 h-40"} rotate-[-90deg]`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="none" className="text-gray-200" />
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
            className={`${isFocus ? "text-primary" : "text-blue-400"} transition-all duration-100 linear`}
          />
        </svg>
        <div className={`${small ? "text-md" : "text-4xl"} font-bold text-gray-800`}>{formatTime(timeLeft)}</div>
      </div>

      {/* Leave Button */}
      {!small && (
        <Link href="/" className="w-full">
          <button className="w-full bg-softYellow text-dark hover:bg-softYellowHover py-2 rounded-lg font-medium transition-colors duration-300">
            Leave Session
          </button>
        </Link>
      )}
    </div>
  );
}
