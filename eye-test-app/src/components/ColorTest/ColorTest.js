import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

const ColorTest = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inputs, setInputs] = useState(Array(5).fill(""));
  const [results, setResults] = useState(Array(5).fill(null));
  const [showModal, setShowModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false); // Track if the microphone is active

  const images = [
    "/images/colour74.png",
    "/images/colour12.png",
    "/images/colour6.png",
    "/images/colour5.png",
    "/images/colour7.png",
  ];

  const correctNumbers = [74, 12, 6, 5, 7];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.trim();
        console.log("Recognized Speech:", spokenText);

        // Extract only the number from the spoken text
        const match = spokenText.match(/\d+/);
        if (match) {
          const spokenNumber = match[0]; // Extracted number as a string
          const newInputs = [...inputs];
          newInputs[currentImageIndex] = spokenNumber;
          setInputs(newInputs);
        }

        setIsListening(false);
      };


      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false); // Stop listening on error
      };

      recognitionInstance.onend = () => {
        setIsListening(false); // Stop listening when recognition ends
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("SpeechRecognition not supported in this browser.");
    }
  }, [currentImageIndex, inputs]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true); // Set listening state to true
      } catch (error) {
        console.warn("Speech recognition is already running.");
      }
    }
  };

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
    <Box textAlign="center" p={3} border={1} borderColor="blue" borderRadius={2} width="50%">
      <Typography variant="h4" gutterBottom>
        Color Blindness Test
      </Typography>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: -300,
              width: "50%",
              padding: 2,
              backgroundColor: "#F5F5F5",
              borderRight: "1px solid #ddd",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
              Instruction
            </Typography>
            <Typography variant="body1">
              Please say
               "the number is xx"
            </Typography>
          </Box>
      <Box mb={3}>
        <img src={images[currentImageIndex]} alt={`Test Image ${currentImageIndex + 1}`} style={{ width: "200px", height: "auto" }} />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <TextField
          value={inputs[currentImageIndex]}
          onChange={handleInputChange}
          placeholder="Enter the number you see"
          variant="outlined"
          sx={{ maxWidth: 250, mb: 2 }}
        />
        <IconButton onClick={startListening} sx={{ ml: 1 }} disabled={isListening}>
          <MicIcon />
        </IconButton>
      </Box>
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