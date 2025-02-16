import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography } from "@mui/material";

const EyeTestCard = ({ onStartTest }) => {
  const [blur, setBlur] = useState(15); // Initial blur level

  // Automatically decrease blur after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setBlur(5); // Reduce blur gradually
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card
    sx={{
      width: "auto", // Adjust width to fit content
      height: "auto", // Adjust height dynamically
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute", // Position at bottom of screen
      bottom: "20%", // Keep some space from the bottom
      left: "50%",
      transform: "translateX(-50%)", // Center the card horizontally
      backdropFilter: "blur(8px)", // Apply blur effect
      background: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent background
      borderRadius: 4,
      padding: "20px 20px", // Padding around the button
      transition: "backdrop-filter 1s ease-in-out",
      "&:hover": {
        backdropFilter: "blur(0px)", // Clear blur on hover
      },
    }}
  >
    <CardContent sx={{ padding: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={onStartTest}
        sx={{
          bgcolor: "#ff5722", // Modern color
          "&:hover": { bgcolor: "#e64a19" },
        }}
      >
        Test Your Eye
      </Button>
    </CardContent>
  </Card>
  );
};

export default EyeTestCard;