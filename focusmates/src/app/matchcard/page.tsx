// src/app/matchcard/page.tsx
"use client";

import MatchCard from "@/components/MatchCard";

export default function MatchCardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Matches</h1>

      <MatchCard
        name="Alice"
        degree="Computer Science"
        skills={["Python", "AI", "Databases"]}
        onInvite={() => alert("Invited Alice")}
      />

      <MatchCard
        name="Bob"
        degree="Software Engineering"
        skills={["JavaScript", "React", "Node.js"]}
        onInvite={() => alert("Invited Bob")}
      />
    </main>
  );
}
