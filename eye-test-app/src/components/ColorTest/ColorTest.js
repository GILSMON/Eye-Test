import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

const ColorTest = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inputs, setInputs] = useState(Array(5).fill(""));
  const [results, setResults] = useState(Array(5).fill(null));
  const [showModal, setShowModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");


  const images = [
    "/images/colour74.png",
    "/images/colour12.png",
    "/images/colour6.png",
    "/images/colour5.png",
    "/images/colour7.png",
    ];

  const correctNumbers = [74, 12, 6, 5, 7];

  const handleInputChange = (e) => {
    const newInputs = [...inputs];
    newInputs[currentImageIndex] = e.target.value;
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    const currentNumber = correctNumbers[currentImageIndex];
    const userInput = parseInt(inputs[currentImageIndex]);
    const isCorrect = userInput === currentNumber;

    const newResults = [...results];
    newResults[currentImageIndex] = { correct: isCorrect, userInput, correctNumber: currentNumber };
    setResults(newResults);

    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      const correctCount = newResults.filter((result) => result?.correct).length;
      let summary = `Test completed! You got ${correctCount} out of 5 correct.\n\n`;
      newResults.forEach((result, index) => {
        if (!result?.correct) {
          summary += `Image ${index + 1}: You entered ${result?.userInput}, but the correct number is ${result?.correctNumber}.\n`;
        }
      });
      setSummaryContent(summary);
      setShowModal(true);
    }
  };

  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h4" gutterBottom>
        Color Blindness Test
      </Typography>
      <Box mb={3}>
        <img src={images[currentImageIndex]} alt={`Test Image ${currentImageIndex + 1}`} style={{ width: "200px", height: "auto" }} />
      </Box>
      <TextField
        value={inputs[currentImageIndex]}
        onChange={handleInputChange}
        placeholder="Enter the number you see"
        variant="outlined"
        fullWidth
        sx={{ maxWidth: 300, mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit
      </Button>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Test Result</DialogTitle>
        <DialogContent>
          <pre>{summaryContent}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ColorTest;
