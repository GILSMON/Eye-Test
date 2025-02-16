import React, { useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";

const directions = ["up", "down", "left", "right"];

const LandoltTest = ({ onFinish }) => {
  const [size, setSize] = useState(200);
  const [opacity, setOpacity] = useState(1.0);
  const [failCount, setFailCount] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [testEnded, setTestEnded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [currentDirection, setCurrentDirection] = useState(
    directions[Math.floor(Math.random() * directions.length)]
  );

  const handleAnswer = (answer) => {
    if (testEnded) return; // Stop answering if the test has ended

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (answer === currentDirection) {
      setSize((prev) => Math.max(prev * 0.9, 20));
      setOpacity((prev) => Math.max(prev * 0.9, 0.2));
      setScore(score + 1);
      setFailCount(0);
    } else {
      setFailCount(failCount + 1);
    }

    // End the test on two consecutive wrong answers or after 20 clicks
    if (failCount + 1 === 2 || newAttempts === 20) {
      setTestEnded(true);
      setSnackbarOpen(true); // Show result pop-up
      if (onFinish) onFinish(score);
    } else {
      setCurrentDirection(directions[Math.floor(Math.random() * directions.length)]);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Landolt Rings Eye Test
      </Typography>
      <Typography variant="h6">Score: {score}</Typography>
      <Typography variant="h6">Attempts: {attempts} / 20</Typography>
      <img
        src={`/images/landolt_${currentDirection}.png`}
        alt={`Landolt Ring - ${currentDirection}`}
        style={{ width: size, height: size, opacity, margin: "20px" }}
      />
      <Typography>Where is the gap?</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {directions.map((dir) => (
          <Button
            key={dir}
            variant="contained"
            onClick={() => handleAnswer(dir)}
            disabled={testEnded} // Disable buttons when the test ends
          >
            {dir.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000} // Display for 5 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ transform: "scale(4)" }} // Increases overall size
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" ,fontSize: "1.5rem", // Increase text size
            padding: "20px",}}
          
        >
          Test Ended! Your Score: {score}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandoltTest;