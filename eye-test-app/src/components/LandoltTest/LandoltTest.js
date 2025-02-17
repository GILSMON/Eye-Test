import React, { useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";

const directions = ["up", "down", "left", "right"];

const LandoltTest = ({ onFinish, onScoreChange }) => {
  const [size, setSize] = useState(200); // Initial size of the Landolt ring
  const [opacity, setOpacity] = useState(1.0); // Initial opacity of the Landolt ring
  const [failCount, setFailCount] = useState(0); // Count of consecutive wrong answers
  const [score, setScore] = useState(0); // Current score
  const [attempts, setAttempts] = useState(0); // Total attempts made
  const [testEnded, setTestEnded] = useState(false); // Whether the test has ended
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls the visibility of the result pop-up
  const [currentDirection, setCurrentDirection] = useState(
    directions[Math.floor(Math.random() * directions.length)] // Random initial direction
  );

  // Handle user's answer
  const handleAnswer = (answer) => {
    if (testEnded) return; // Stop answering if the test has ended

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (answer === currentDirection) {
      // Correct answer: reduce size, opacity, and increase score
      setSize((prev) => Math.max(prev * 0.8, 5));
      setOpacity((prev) => Math.max(prev * 0.8, 0.08));
      setScore(score + 1);
      setFailCount(0);
    } else {
      // Wrong answer: increment fail count
      setFailCount(failCount + 1);
    }

    // Notify parent component about the score change
    if (onScoreChange) {
      onScoreChange(score + (answer === currentDirection ? 1 : 0));
    }

    // End the test on two consecutive wrong answers or after 20 attempts
    if (failCount +1 === 2 || newAttempts === 20) {
      setTestEnded(true);
      setSnackbarOpen(true); // Show result pop-up
      if (onFinish) onFinish(score); // Notify parent component that the test has ended
    } else {
      // Continue the test: choose a new random direction
      setCurrentDirection(directions[Math.floor(Math.random() * directions.length)]);
    }
  };

  // Reset the test to its initial state
  const handleRestart = () => {
    setSize(200);
    setOpacity(1.0);
    setFailCount(0);
    setScore(0);
    setAttempts(0);
    setTestEnded(false);
    setSnackbarOpen(false);
    setCurrentDirection(directions[Math.floor(Math.random() * directions.length)]);
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

      {/* Display the Landolt ring image */}
      <img
        src={`/images/landolt_${currentDirection}.png`} // Path to the Landolt ring image
        alt={`Landolt Ring - ${currentDirection}`}
        style={{ width: size, height: size, opacity, margin: "20px" }}
      />

      <Typography>Where is the gap?</Typography>

      {/* Buttons for user to select the direction */}
      {!testEnded ? (
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
      ) : (
        // Restart button when the test ends
        <Button variant="contained" color="primary" onClick={handleRestart} sx={{ mt: 2 }}>
          Restart Test
        </Button>
      )}

      {/* Toast notification to display the test result */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000} // Display for 5 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{
            width: "100%",
            fontSize: "1.5rem",
            padding: "20px",
          }}
        >
          Test Ended! Your Score: {score}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandoltTest;