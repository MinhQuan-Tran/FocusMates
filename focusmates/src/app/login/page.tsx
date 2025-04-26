"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../src/firebase"; // Adjust if needed
// import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <main
      style={{
        maxWidth: "420px",
        margin: "4rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "Poppins, sans-serif"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <svg width="200" height="50" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="10" fill="#2F2F2F" />
          <circle cx="20" cy="50" r="8" fill="#2F2F2F" />
          <rect x="12" y="55" width="26" height="10" rx="5" fill="#2F2F2F" />
          <circle cx="60" cy="40" r="18" fill="none" stroke="#2ecc71" strokeWidth="4" />
          <line x1="60" y1="40" x2="60" y2="30" stroke="#2F2F2F" strokeWidth="2" />
          <line x1="60" y1="40" x2="68" y2="44" stroke="#2F2F2F" strokeWidth="2" />
          <text x="90" y="50" fontFamily="Poppins, sans-serif" fontSize="32" fontWeight="600">
            <tspan fill="#2ecc71">Focus</tspan>
            <tspan fill="#2F2F2F">Mates</tspan>
          </text>
        </svg>
      </div>

      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#2F2F2F" }}>{isSignUp ? "Sign Up" : "Sign In"}</h1>

      <form onSubmit={handleAuth}>
        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button type="submit" style={buttonStyle}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#2F2F2F" }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            background: "none",
            border: "none",
            color: "#2ecc71",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0
          }}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </main>
  );
}

// 🧾 Styles
const labelStyle = {
  color: "#2F2F2F",
  fontWeight: 500,
  fontSize: "0.95rem",
  marginTop: "0.75rem",
  display: "block"
} as const;

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  marginTop: "0.3rem",
  marginBottom: "1rem",
  backgroundColor: "#f8f8f8",
  color: "#2F2F2F"
} as const;

const buttonStyle = {
  marginTop: "0.5rem",
  backgroundColor: "#2ecc71",
  color: "#fff",
  padding: "0.6rem 1.2rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%"
} as const;
