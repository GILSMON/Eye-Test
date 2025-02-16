import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LoginModal from "../Login/LoginModal";
import SignupN from "../../pages/Signup/SignupN";

const Navbar = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false); // State for signup modal

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#0D1B2A",
          paddingY: 1.5, // Increased vertical padding
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo or Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#E0E1DD",
              letterSpacing: 1,
              userSelect: "none",
            }}
          >
            Eye Test App
          </Typography>

          {/* Navigation Links */}
          <Box>
            <Button component={Link} to="/" sx={navButtonStyle}>
              Help
            </Button>
            <Button
              sx={{
                ...navButtonStyle,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                paddingX: 3,
              }}
              onClick={() => setOpenLogin(true)}
            >
              Login
            </Button>
            <Button
              sx={{
                ...navButtonStyle,
                backgroundColor: "#E0E1DD",
                color: "#0D1B2A",
                paddingX: 3,
              }}
              onClick={() => setOpenSignup(true)} // Open Signup modal
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Modal */}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />
        {/* Signup Modal */}
      <SignupN open={openSignup} handleClose={() => setOpenSignup(false)} />
    </>
  );
};

// Common Button Styles
const navButtonStyle = {
  color: "#E0E1DD",
  textTransform: "none",
  fontSize: "18px",
  marginLeft: "12px",
  paddingX: 2.5,
  paddingY: 1.2,
  borderRadius: "8px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
};

export default Navbar;