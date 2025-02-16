import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

const Signup = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
      });

      toast.success("Signup successful! 🎉");
      handleClose();
      navigate("/user");
    } catch (error) {
      console.error("Error signing up:", error.message);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Sign Up
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#0D1B2A",
                color: "white",
                paddingY: 1.2,
                "&:hover": { backgroundColor: "#0A1522" },
              }}
              fullWidth
            >
              Sign Up
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mt: 2, cursor: "pointer", color: "#1976d2" }}
            onClick={handleClose}
          >
            Already have an account? Log in
          </Typography>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default Signup;