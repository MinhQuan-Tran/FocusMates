// pages/match.js
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

// Dummy users
const dummyUsers = [
  { uid: "mock-user-1", email: "user1@example.com", displayName: "Alice", degree: "Computer Science", skills: ["JavaScript", "React", "Node.js"], streak: 5, points: 100 },
  { uid: "mock-user-2", email: "user2@example.com", displayName: "Bob", degree: "Engineering", skills: ["Python", "Machine Learning", "TensorFlow"], streak: 3, points: 150 },
  { uid: "mock-user-3", email: "user3@example.com", displayName: "Charlie", degree: "Data Science", skills: ["Python", "Pandas", "Data Analysis"], streak: 10, points: 110 },
  { uid: "mock-user-4", email: "user4@example.com", displayName: "David", degree: "Computer Science", skills: ["JavaScript", "Node.js", "Firebase"], streak: 6, points: 200 },
  { uid: "mock-user-5", email: "user5@example.com", displayName: "Eve", degree: "Electrical Engineering", skills: ["C++", "Embedded Systems", "Python"], streak: 2, points: 80 },
  { uid: "mock-user-6", email: "user6@example.com", displayName: "Alladin", degree: "Information Technology", skills: ["Python", "JavaScript", "React"], streak: 2, points: 80 },
  { uid: "mock-user-7", email: "user7@example.com", displayName: "Zara", degree: "Mathematics", skills: ["Python", "JavaScript", "Statistics"], streak: 4, points: 500 },
];

// Assign different emojis for each dummy user
const getUserAvatar = (user) => {
  switch (user.uid) {
    case "mock-user-1":
      return "https://em-content.zobj.net/thumbs/240/apple/354/grinning-face_1f600.png"; // Alice
    case "mock-user-2":
      return "https://em-content.zobj.net/thumbs/240/apple/354/robot_1f916.png"; // Bob
    case "mock-user-3":
      return "https://em-content.zobj.net/thumbs/240/apple/354/man-scientist_1f468_200d_1f52c.png"; // Charlie
    case "mock-user-4":
      return "https://em-content.zobj.net/thumbs/240/apple/354/man-technologist_1f468_200d_1f4bb.png"; // David
    case "mock-user-5":
      return "https://em-content.zobj.net/thumbs/240/apple/354/woman-technologist_1f469_200d_1f4bb.png"; // Eve
    case "mock-user-6":
      return "https://em-content.zobj.net/thumbs/240/apple/354/genie_1f9de.png"; // Alladin
    case "mock-user-7":
      return "https://em-content.zobj.net/thumbs/240/apple/354/robot_1f916.png"; // Zara
    default:
      return "https://em-content.zobj.net/thumbs/240/apple/354/see-no-evil-monkey_1f648.png";
  }
};

const renderStars = (count) =>
  [...Array(5)].map((_, i) => (
    <span key={i} style={{ color: i < count ? "#ffd700" : "#ccc", fontSize: "1.4rem" }}>★</span>
  ));

export default function MatchPage() {
  const [topMatches, setTopMatches] = useState([]);
  const [hasMatched, setHasMatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const findMatches = () => {
    setLoading(true);
    setHasMatched(false);
  
    setTimeout(() => {
      const scored = dummyUsers.map((user) => {
        const sharedSkills = user.skills.filter((s) => currentUser.skills.includes(s));
        const union = new Set([...user.skills, ...currentUser.skills]).size;
        const compatibility = union > 0 ? sharedSkills.length / union : 0;
        const comboScore = compatibility * user.points;
        return {
          ...user,
          sharedSkills,
          compatibility,
          comboScore,
          stars: Math.round(compatibility * 5),
          availablePoints: currentUser.streak * user.streak,
        };
      });
  
      // Sort by compatibility, comboScore, and points
      const bestCompatibility = scored.sort((a, b) => b.compatibility - a.compatibility)[0];
      const balancedMatch = scored.sort((a, b) => b.comboScore - a.comboScore)[0];
      
      // Sort by points and pick the highest points match
      const mostPoints = scored.sort((a, b) => b.points - a.points)[0];
  
      // Ensure the matches are unique by filtering out duplicates
      const uniqueMatches = [bestCompatibility, balancedMatch, mostPoints].filter(
        (m, i, arr) => arr.findIndex((u) => u.uid === m.uid) === i
      );
  
      setTopMatches(uniqueMatches);
      setHasMatched(true);
      setLoading(false);
    }, 4000);
  };
  

  // Render user card
  const renderUserCard = (user, isCurrentUser = false, label = null, color = "#fff") => (
    <div
      key={user.uid}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: color,
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "left",
        minHeight: "160px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.6rem", color: "#212121" }}>
          {user.displayName} {isCurrentUser ? "(You)" : ""}
          {label && <span style={{ marginLeft: "0.5rem", fontSize: "1rem", color: "#424242" }}>{label}</span>}
        </h2>
        <p style={{ color: "#616161", marginBottom: "0.6rem", fontSize: "1rem" }}>{user.degree}</p>
        <p style={{ fontSize: "1rem", color: "#424242", marginBottom: "0.6rem" }}>
          Skills:{" "}
          {user.skills.map((skill, i) => {
            const shared = currentUser.skills.includes(skill);
            return (
              <span
                key={i}
                style={{
                  color: shared ? "#2e7d32" : "#424242",
                  fontWeight: shared ? "bold" : "normal",
                  fontSize: "1rem",
                }}
              >
                {skill}
                {i < user.skills.length - 1 && ", "}
              </span>
            );
          })}
        </p>
        <p style={{ fontSize: "1rem", color: "#424242", margin: "0.4rem 0" }}>Streak: <strong>{user.streak}</strong></p>
        <p style={{ fontSize: "1rem", color: "#424242", margin: "0.4rem 0" }}>Points: <strong>{user.points}</strong></p>
        {!isCurrentUser && (
          <>
            <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#d32f2f", margin: "0.6rem 0" }}>
              Compatibility: {renderStars(user.stars)}
            </p>
            <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#0288d1", margin: "0.6rem 0" }}>
              Available Points: {user.availablePoints}
            </p>
            <button
              onClick={() => alert(`Connecting with ${user.displayName}…`)}
              style={{
                display: "block",
                margin: "1rem auto 0",
                padding: "1rem 2rem",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Connect
            </button>
          </>
        )}
      </div>

      {/* Avatar */}
      <img
        src={isCurrentUser ? "https://em-content.zobj.net/thumbs/240/apple/354/nerd-face_1f913.png" : getUserAvatar(user)}
        alt="user avatar"
        style={{ width: 80, height: 80, borderRadius: "50%", marginLeft: "1rem" }}
      />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, #6200ea 0%, #03dac6 100%),
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
          background: "#fefefe",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: "bold", marginBottom: "2rem", color: "#212121" }}>
          Find a Study Partner
        </h1>

        {/* Current user card (hide after matching) */}
        {!hasMatched && renderUserCard(currentUser, true, null, "#e3f2fd")}

        

        {/* Match button */}
        {!hasMatched && !loading && (
          <div style={{ textAlign: "center", marginBottom: "2rem", paddingTop: "2rem" }}>
            <button
              onClick={findMatches}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.2rem",
                backgroundColor: "#e53935",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              Match Me
            </button>
          </div>
        )}



      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", fontSize: "1.5rem", color: "#555", paddingTop: "2rem" }}>
          🔍 Searching for matches…
        </div>
      )}


        {/* Top 3 Matches */}
        {hasMatched && !loading && (
          <div style={{ display: "grid", gap: "2rem", paddingTop: "1rem" }}>
            {topMatches.map((user, idx) => {
              let label = null;
              let color = "#fff";
              if (idx === 0) {
                label = "🥇 Best Compatibility";
                color = "#fff8e1";
              } else if (idx === 1) {
                label = "🏆 High Points Match";
                color = "#eceff1";
              } else if (idx === 2) {
                label = "⚖️ Most Points";
                color = "#efebe9";
              }
              return renderUserCard(user, false, label, color);
            })}
          </div>
        )}
      </div>
    </div>
  );
}
