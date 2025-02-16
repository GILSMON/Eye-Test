import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LoginModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      handleClose(); // Close the modal on success
      navigate("/user"); // Redirect to the user page
    } catch (error) {
      alert("Invalid email or password.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(10px)",
          padding: 4,
          borderRadius: 3,
          width: 320,
          color: "white",
          boxShadow: 24,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>

        {/* Card UI for Login */}
        <Card sx={{ bgcolor: "transparent", boxShadow: "none" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#1976D2",
                  padding: 1.5,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#1565C0" },
                }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default LoginModal;