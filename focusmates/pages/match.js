// pages/match.js
import { useEffect } from "react";
import useMatch from "../hooks/useMatch";
import MatchCard from "../components/MatchCard";

export default function MatchPage() {
  const { candidates, findMatches, sendInvite, error } = useMatch();

  useEffect(() => { findMatches(); }, []);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Find a Study Partner</h1>
      {candidates.length === 0
        ? <p>No matches found—try adding skills to your profile.</p>
        : candidates.map(u => (
            <MatchCard
              key={u.id}
              user={u}
              onInvite={() => sendInvite(u.uid)}
            />
          ))
      }
    </div>
  );
}
