import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import WebcamFeed from "../../components/WebcamCapture/WebcamFeed";

const Userexercise = () => {
    const [status, setStatus] = useState(null);
  
    const handleStatusChange = (newStatus) => {
      console.log("Status received in Userexercise:", newStatus); // ✅ Console log
      setStatus(newStatus);
    };
  
    return (
      <Box sx={{ textAlign: "center", mt: 2, background: "red", padding: 2 }}>
        <Typography variant="h4" sx={{ color: "white" }}>Let's do exercise</Typography>
        {status && <Typography variant="h6">Current Status: {status}</Typography>} {/* ✅ Now status is used */}
        <WebcamFeed onStatusChange={handleStatusChange} />
      </Box>
    );
  };
  
  export default Userexercise;