// addDummyUsers.js

import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";


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
    {
      uid: "mock-user-6",
      email: "user6@example.com",
      displayName: "Frank",
      name: "Frank",
      degree: "Information Technology",
      skills: ["Java", "Spring Boot", "Microservices"],
      streak: 7,
      points: 250,
    },
    {
      uid: "mock-user-7",
      email: "user7@example.com",
      displayName: "Grace",
      name: "Grace",
      degree: "Data Science",
      skills: ["R", "Machine Learning", "Data Visualization"],
      streak: 1,
      points: 60,
    },
    {
      uid: "mock-user-8",
      email: "user8@example.com",
      displayName: "Hannah",
      name: "Hannah",
      degree: "Software Engineering",
      skills: ["JavaScript", "React", "Vue.js"],
      streak: 3,
      points: 130,
    },
    {
      uid: "mock-user-9",
      email: "user9@example.com",
      displayName: "Ivy",
      name: "Ivy",
      degree: "Artificial Intelligence",
      skills: ["Machine Learning", "Python", "Deep Learning"],
      streak: 2,
      points: 90,
    },
    {
      uid: "mock-user-10",
      email: "user10@example.com",
      displayName: "Jack",
      name: "Jack",
      degree: "Computer Science",
      skills: ["Java", "Android Development", "Kotlin"],
      streak: 4,
      points: 120,
    }
  ];
  
  // Function to add the users to Firestore
  const addUsersToFirestore = async () => {
    try {
      for (let user of dummyUsers) {
        await addDoc(collection(db, "users"), user);
        console.log(`User ${user.uid} added successfully.`);
      }
    } catch (e) {
      console.error("Error adding users:", e);
    }
  };

addUsersToFirestore();
