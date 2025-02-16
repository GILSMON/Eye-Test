import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score } = location.state || { score: 0 }; // Default score if none is provided

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Eye Test Completed!
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Score: <strong>{score}</strong>
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Restart Test
      </Button>
    </Box>
  );
};

export default Result;