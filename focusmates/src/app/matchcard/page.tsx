// components/MatchCard.tsx
import React from "react";

interface MatchCardProps {
  name: string;
  degree: string;
  skills: string[];
  onInvite: () => void;
}

const MatchCardPage: React.FC<MatchCardProps> = ({ name, degree, skills, onInvite }) => (
  <div
    style={{
      border: "1px solid #ddd",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      background: "#fff"
    }}
  >
    <h3 style={{ marginBottom: 0 }}>{name}</h3>
    <p>
      <strong>Degree:</strong> {degree}
    </p>
    <p>
      <strong>Skills:</strong> {skills.join(", ")}
    </p>
    <button onClick={onInvite}>Invite to Study</button>
  </div>
);

export default MatchCardPage;
