import { useState } from "react";

// Current user (mocked)
const currentUser = {
  uid: "current-user",
  email: "me@example.com",
  displayName: "J.Monash",
  name: "J.Monash",
  degree: "Computer Science",
  skills: ["JavaScript", "React", "Python"],
  streak: 16,
  points: 1000,
};

const dummyUsers = [
  {
    uid: "mock-user-1",
    email: "user1@example.com",
    displayName: "Alice",
    degree: "Computer Science",
    skills: ["JavaScript", "React", "Node.js"],
    streak: 5,
    points: 100,
  },
  {
    uid: "mock-user-2",
    email: "user2@example.com",
    displayName: "Bob",
    degree: "Engineering",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    streak: 3,
    points: 150,
  },
  {
    uid: "mock-user-3",
    email: "user3@example.com",
    displayName: "Charlie",
    degree: "Data Science",
    skills: ["Python", "Pandas", "Data Analysis"],
    streak: 4,
    points: 110,
  },
  {
    uid: "mock-user-4",
    email: "user4@example.com",
    displayName: "David",
    degree: "Computer Science",
    skills: ["JavaScript", "Node.js", "Firebase"],
    streak: 6,
    points: 200,
  },
  {
    uid: "mock-user-5",
    email: "user5@example.com",
    displayName: "Eve",
    degree: "Electrical Engineering",
    skills: ["C++", "Embedded Systems", "Python"],
    streak: 2,
    points: 80,
  },
  {
    uid: "mock-user-6",
    email: "user6@example.com",
    displayName: "Alladin",
    degree: "Information Technology",
    skills: ["Python", "JavaScript", "React"],
    streak: 2,
    points: 80,
  },
];

// Star rating out of 5
const renderStars = (count) => {
  return [...Array(5)].map((_, i) => (
    <span key={i} style={{ color: i < count ? "gold" : "#ddd", fontSize: "1.2rem" }}>
      ★
    </span>
  ));
};

export default function MatchPage() {
  const [matches, setMatches] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const findMatches = () => {
    setLoading(true);
    setHasMatched(false);

    setTimeout(() => {
      const scored = dummyUsers
        .map((user) => {
          // Jaccard ratio: intersection / union
          const intersection = user.skills.filter((s) => currentUser.skills.includes(s)).length;
          const union = new Set([...user.skills, ...currentUser.skills]).size;
          const ratio = union > 0 ? intersection / union : 0;
          return {
            ...user,
            compatibilityRatio: ratio,
            stars: Math.round(ratio * 5),
          };
        })
        .filter((u) => u.stars > 0) // at least one common skill
        .sort((a, b) => b.compatibilityRatio - a.compatibilityRatio);

      setMatches(scored);
      setLoading(false);
      setHasMatched(true);
    }, 1500);
  };

  const renderUserCard = (user, isCurrentUser = false) => (
    <div
      key={user.uid}
      style={{
        background: isCurrentUser ? "#e0f7fa" : "#fff",
        borderRadius: "10px",
        padding: "1rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        {user.displayName} {isCurrentUser ? "(You)" : ""}
      </h2>
      <p style={{ color: "#666", marginBottom: "0.5rem" }}>{user.degree}</p>
      <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
        Skills:{" "}
        {user.skills.map((skill, i) => (
          <span
            key={i}
            style={{
              color: currentUser.skills.includes(skill) ? "green" : "#555",
              fontWeight: currentUser.skills.includes(skill) ? "bold" : "normal",
            }}
          >
            {skill}
            {i < user.skills.length - 1 && ", "}
          </span>
        ))}
      </p>

      {/* Always show streak & points */}
      <div style={{ marginTop: "1rem" }}>
        <p style={{ margin: "0.3rem 0", fontWeight: isCurrentUser ? "" : "normal" }}>
          Streak: {user.streak}
        </p>
        <p style={{ margin: "0.3rem 0", fontWeight: isCurrentUser ? "" : "normal" }}>
          Points: {user.points}
        </p>

        {/* Only show compatibility & Connect button for others */}
        {!isCurrentUser && (
          <>
            <div style={{ marginTop: "0.5rem" }}>Compatibility: {renderStars(user.stars)}</div>
            <button
              onClick={() => alert(`Connecting with ${user.displayName}…`)}
              style={{
                marginTop: "0.8rem",
                padding: "0.6rem 1.2rem",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Connect
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, rgb(8, 44, 205) 0%, rgb(111, 206, 230) 100%),
          url('https://www.transparenttextures.com/patterns/asfalt-light.png')
        `,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          width: "100%",
          background: "#f0f0f3",
          borderRadius: "20px",
          boxShadow: "inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
          }}
        >
          Find a Study Partner
        </h1>

        {/* Current user */}
        <div style={{ marginBottom: "2rem" }}>{renderUserCard(currentUser, true)}</div>

        {/* Match button */}
        {!hasMatched && !loading && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button
              onClick={findMatches}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.25rem",
                backgroundColor: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              Match Me
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", fontSize: "1.4rem", color: "#777" }}>
            🔍 Searching for matches…
          </div>
        )}

        {/* No matches */}
        {hasMatched && !loading && matches.length === 0 && (
          <div style={{ textAlign: "center", color: "#777", fontSize: "1.1rem" }}>
            No matches found based on your skills.
          </div>
        )}

        {/* Matches grid */}
        {hasMatched && matches.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {matches.map((user) => renderUserCard(user))}
          </div>
        )}
      </div>
    </div>
  );
}
