// src/pages/Signup/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth,db } from "../../firebaseConfig"; 
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "../../firebaseConfig";


import "./Signup.css";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
  
    const handleSignup = async (e) => {
      e.preventDefault();
  
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Store additional user info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email,
        });
  
        toast.success("Signup successful! 🎉");
        navigate("/user");

      } catch (error) {
        console.error("Error signing up:", error.message);
        toast.error(error.message);
      }
    };
  
    return (
      <div className="signup-container">
        <div className="signup-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Signup;