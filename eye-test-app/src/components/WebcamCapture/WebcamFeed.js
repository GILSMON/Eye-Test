import { useEffect, useRef, useState } from "react";
import { Button, Paper, Typography, Box,TextField } from "@mui/material";
import { eventBus } from "../../utils/eventBus";


export default function WebcamFeed() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
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
                console.log("Received status:", data.status);  // Debugging log
                eventBus.emit("response", data.status);
            }
            if (data.blinks) {
                console.log("Received status:", data.blinks);  // Debugging log
                eventBus.emit("blinks", data.blinks);
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
            startVideo();
            interval = setInterval(sendFrame, 1000 / 5);
        } else {
            stopVideo();
        }
        return () => clearInterval(interval);
    }, [isStreaming]);

  return (
    <Box sx={{ bgcolor: "#121212", color: "white", position: "relative", height: "100vh" }}>
        
        {/* Move Buttons Above Both Video Feeds */}
        <Box 
    sx={{
        position: "fixed",
        bottom: 380, // Adjust based on your layout
        right: 20,
        width: 173, // Match this with the camera feed box width
        backgroundColor: "#1E1E1E",
        borderRadius: 2,
        padding: 2,
        textAlign: "center",
        boxShadow: 3,
        border: "2px solid white",
    }}
>
    {/* Tracking Header */}
    <Typography 
        variant="h6" 
        sx={{ 
            color: "white", 
            fontWeight: "bold", 
            mb: 1 
        }}
    >
        Tracking
    </Typography>

    {/* Tracking Controls */}
    <Box sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
        <Button 
            variant="contained" 
            color="success" 
            onClick={() => setIsStreaming(true)} 
            disabled={isStreaming}
            sx={{ width: "40%" }}  // Adjust width for equal spacing
        >
            ▶️
        </Button>
        <Button 
            variant="contained" 
            color="error" 
            onClick={() => setIsStreaming(false)} 
            disabled={!isStreaming}
            sx={{ width: "40%" }}  // Adjust width for equal spacing
        >
            ⏸️
        </Button>
    </Box>
</Box>
        {/* Processed Video Frame */}
        <Box sx={{ position: "fixed", bottom: 200, right: 20, width: 200, height: 150, borderRadius: 2, overflow: "hidden", boxShadow: 3, border: "2px solid white", backgroundColor: "black" }}>
            {processedFrame && <img src={processedFrame} alt="Processed Video Frame" width="100%" height="100%" />}
        </Box>

        {/* Live Webcam Feed */}
        <Box sx={{ position: "fixed", bottom: 20, right: 20, width: 200, height: 150, borderRadius: 2, overflow: "hidden", boxShadow: 3, border: "2px solid white", backgroundColor: "black" }}>
            <video ref={videoRef} autoPlay playsInline width="100%" height="100%" />
        </Box>  

        {/* Status Display */}
        <Typography variant="h6" sx={{ position: "absolute", bottom: 80, right: 20, color: "white" }}>
            Status: {response}
        </Typography>

        <canvas ref={canvasRef} width={400} height={300} style={{ display: "none" }} />
    </Box>
);
}
