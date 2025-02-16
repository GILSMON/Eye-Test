import React, { useState, useRef, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";

const WebcamCapture = () => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [score, setScore] = useState(9);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);

  const handleStartWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws/camera/");
      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
        startFrameCapture();
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received Data:", data); 
        if (data.image) setProcessedImage(data.image);
        if (data.score) setScore(data.score);

        console.log("Received Data:", data.apple);
      };
      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      socketRef.current.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setIsWebcamActive(false);
    }
  };

  const handleStopWebcam = () => {
    setIsWebcamActive(false);
    if (socketRef.current) socketRef.current.close();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setProcessedImage(null);
    setScore(9);
  };

  const startFrameCapture = () => {
    if (!videoRef.current || !canvasRef.current || !socketRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const captureInterval = setInterval(() => {
      if (!isWebcamActive || socketRef.current.readyState !== WebSocket.OPEN) {
        clearInterval(captureInterval);
        return;
      }
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      socketRef.current.send(JSON.stringify({ image: imageData }));
    }, 200);
  };

  useEffect(() => {
    return () => {
      handleStopWebcam();
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2} position="relative">
      <Box>
        <Button variant="contained" color="primary" onClick={handleStartWebcam} disabled={isWebcamActive}>
          Start Webcam
        </Button>
        <Button variant="contained" color="secondary" onClick={handleStopWebcam} disabled={!isWebcamActive} sx={{ ml: 1 }}>
          Stop Webcam
        </Button>
      </Box>

      <Box position="relative">
        {isWebcamActive && (
          <video ref={videoRef} autoPlay style={{ transform: "scaleX(-1)", width: "400px", borderRadius: "8px" }} />
        )}

        {processedImage && (
          <img src={processedImage} alt="Processed" style={{ transform: "scaleX(-1)", width: "400px", borderRadius: "8px" }} />
        )}

      </Box>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
};

export default WebcamCapture;
