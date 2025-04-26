import { useState } from "react";

// Current user (mocked)
const currentUser = {
  uid: "current-user",
  email: "me@example.com",
  displayName: "J.Monash",
  name: "J.Monash",
  degree: "Computer Science",
  skills: ["JavaScript", "React"],
  streak: 7,
  points: 180,
};

const dummyUsers = [
  {
    uid: "mock-user-1",
    email: "user1@example.com",
    displayName: "Alice",
    name: "Alice",
    degree: "Computer Science",
    skills: ["JavaScript", "React", "Node.js"],
    streak: 5,
    points: 100,
  },
  {
    uid: "mock-user-2",
    email: "user2@example.com",
    displayName: "Bob",
    name: "Bob",
    degree: "Engineering",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    streak: 3,
    points: 150,
  },
  {
    uid: "mock-user-3",
    email: "user3@example.com",
    displayName: "Charlie",
    name: "Charlie",
    degree: "Data Science",
    skills: ["Python", "Pandas", "Data Analysis"],
    streak: 4,
    points: 110,
  },
  {
    uid: "mock-user-4",
    email: "user4@example.com",
    displayName: "David",
    name: "David",
    degree: "Computer Science",
    skills: ["JavaScript", "Node.js", "Firebase"],
    streak: 6,
    points: 200,
  },
  {
    uid: "mock-user-5",
    email: "user5@example.com",
    displayName: "Eve",
    name: "Eve",
    degree: "Electrical Engineering",
    skills: ["C++", "Embedded Systems", "Python"],
    streak: 2,
    points: 80,
  },
];

export default function MatchPage() {
  const [userSkills] = useState(currentUser.skills);
  const [matches, setMatches] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const findMatches = () => {
    setLoading(true);
    setHasMatched(false);

    // Delay to give confidence 
    setTimeout(() => {
      const foundMatches = dummyUsers.map((user) => {
        const commonSkills = user.skills.filter((skill) => userSkills.includes(skill));
        return { ...user, commonSkillsCount: commonSkills.length, commonSkills };
      });

      const sortedMatches = foundMatches
        .filter((match) => match.commonSkillsCount > 0)
        .sort((a, b) => b.commonSkillsCount - a.commonSkillsCount);

      setMatches(sortedMatches);
      setLoading(false);
      setHasMatched(true);
    }, 1500);
  };

  const highlightSkills = (skills) => {
    return skills.map((skill, index) => (
      <span
        key={index}
        style={{
          color: userSkills.includes(skill) ? "green" : "#555",
          fontWeight: userSkills.includes(skill) ? "bold" : "normal",
        }}
      >
        {skill}
        {index < skills.length - 1 && ", "}
      </span>
    ));
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
      <p style={{ fontSize: "0.9rem", color: "#555" }}>
        Skills: {highlightSkills(user.skills)}
      </p>
      <div style={{ marginTop: "1rem" }}>
        <p style={{ margin: "0.3rem 0" }}>Streak: {user.streak}</p>
        <p style={{ margin: "0.3rem 0" }}>Points: {user.points}</p>
        {!isCurrentUser && (
          <button
            onClick={() => alert(`Connecting with ${user.displayName}...`)}
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
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9ff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", width: "100%", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", padding: "2rem" }}>
        <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Find a Study Partner</h1>

        <div style={{ marginBottom: "2rem" }}>
          {renderUserCard(currentUser, true)}
        </div>

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

        {loading && (
          <div style={{ textAlign: "center", fontSize: "1.4rem", color: "#777" }}>
            🔍 Searching for matches...
          </div>
        )}

        {hasMatched && matches.length === 0 && !loading && (
          <div style={{ textAlign: "center", color: "#777", fontSize: "1.1rem" }}>
            No matches found based on your skills.
          </div>
        )}

        {hasMatched && matches.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {matches.map((user) => renderUserCard(user))}
          </div>
        )}
      </div>
    </div>
  );
}
