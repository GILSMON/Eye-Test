import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

const Userexercise = () => {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

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
            query: text,
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
      <Typography variant="h4" sx={{ mb: 2 }}>
        Eye Exercise
      </Typography>
      <TextField
        label="Enter something..."
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSend}>
        Send
      </Button>
    </Box>
  );
};

export default Userexercise;