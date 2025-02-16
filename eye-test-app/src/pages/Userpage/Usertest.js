import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LandoltTest from "../../components/LandoltTest/LandoltTest";

const Userexercise = () => {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/stream/text/");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Received from backend:", response);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
            type: "text_query",
            query: "hi",
          });
        socket.send(message);
        console.log("Sent to backend:", text);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        sx={{ position: "absolute", top: 20, left: 20 }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Eye Test
      </Typography>
      <Button variant="contained" onClick={handleSend}>
          Get Report
          </Button>
        <LandoltTest />

     
    </Box>
  );
};

export default Userexercise;

