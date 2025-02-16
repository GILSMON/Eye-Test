import React, { useState, useRef, useEffect } from "react";
import { Button, Box, TextField } from "@mui/material";

const DataCapture = () => {
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);
 // const valueToSend = 78;

  useEffect(() => {
    socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/stream/");
    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };
    socketRef.current.onmessage = (event) => {
      console.log("Received Data:", event.data);
    };
    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const handleSendData = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ input: inputValue }));
      
      console.log("Sent:", inputValue);
    }
  };

  

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
      <TextField
        label="Enter Value"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSendData}>
        Send to Backend
      </Button>
    </Box>
  );
};

export default DataCapture;

// Commented out camera functionality
// const [isWebcamActive, setIsWebcamActive] = useState(false);
// const [processedImage, setProcessedImage] = useState(null);
// const videoRef = useRef(null);
// const canvasRef = useRef(null);
// const streamRef = useRef(null);

// const handleStartWebcam = async () => {
//   setIsWebcamActive(true);
//   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   if (videoRef.current) {
//     videoRef.current.srcObject = stream;
//     streamRef.current = stream;
//   }
// };

// const handleStopWebcam = () => {
//   setIsWebcamActive(false);
//   if (streamRef.current) {
//     streamRef.current.getTracks().forEach((track) => track.stop());
//     streamRef.current = null;
//   }
//   setProcessedImage(null);
// };

// useEffect(() => {
//   return () => {
//     handleStopWebcam();
//   };
// }, []);
