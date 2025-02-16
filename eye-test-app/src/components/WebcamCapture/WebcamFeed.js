import { useEffect, useRef, useState } from "react";
import { Button, Paper, Typography, Box } from "@mui/material";

export default function WebcamFeed() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null); // Store video stream for stopping later
    const [ws, setWs] = useState(null);
    const [response, setResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [processedFrame, setProcessedFrame] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:8000/ws/stream/image/");
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.image) {
              setProcessedFrame(`data:image/jpeg;base64,${data.image}`);
          }
          if (data.status) {
            console.log("Received status:", data.status);  // 🔍 Debugging log
        }
      };
        setWs(socket);
        return () => socket.close();
    }, []);

    const startVideo = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              streamRef.current = stream;
              setIsCameraOn(true);
          }
      } catch (error) {
          console.error("Error accessing camera:", error);
      }
  };

  const stopVideo = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
};

    const sendFrame = () => {
        if (!videoRef.current || !canvasRef.current || !ws || !isStreaming) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasRef.current.toBlob((blob) => {
            if (blob && ws.readyState === WebSocket.OPEN) {
                ws.send(blob);
            }
        }, "image/jpeg");
    };

    useEffect(() => {
      let interval;
      if (isStreaming) {
          startVideo(); // Start video when streaming begins
          interval = setInterval(sendFrame, 1000 / 5); // Send 5 FPS
      } else {
          stopVideo(); // Stop video when streaming ends
      }
      return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <Box
        sx={{
            bgcolor: "#121212",
            color: "white",
            position: "relative",
            height: "100vh",
        }}
    >
        {/* Start & Stop Buttons - Positioned at the Top-Right */}
        <Box
            sx={{
                position: "absolute",
                top: 20, // Adjust if needed
                right: 20,
                display: "flex",
                gap: 2,
                zIndex: 10, // Ensures it stays above other elements
            }}
        >
            <Button
                variant="contained"
                color="success"
                onClick={() => setIsStreaming(true)}
                disabled={isStreaming}
            >
                Start 
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={() => setIsStreaming(false)}
                disabled={!isStreaming}
            >
                Stop
            </Button>
        </Box>
        <Box
    sx={{
        position: "fixed",
        bottom: 200, // Place above the live feed
        right: 20,
        width: 200,
        height: 150,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        border: "2px solid white",
        backgroundColor: "black",
    }}
>
    {processedFrame && <img src={processedFrame} alt="Processed Video Frame" width="100%" height="100%" />}
</Box>

        {/* Camera Feed Styled Like Teams Call (Bottom-Right Corner) */}
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 200,
                height: 150,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                border: "2px solid white",
                backgroundColor: "black",
            }}
        >
            <video ref={videoRef} autoPlay playsInline width="100%" height="100%" />
        </Box>

        {/* Hidden Canvas for Image Processing */}
        <canvas ref={canvasRef} width={400} height={300} style={{ display: "none" }} />
    </Box>
);
}