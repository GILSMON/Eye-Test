import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions ,Container, AppBar, Toolbar, Tabs, Tab,TextField} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LandoltTest from "../../components/LandoltTest/LandoltTest";
import ColorBlindnessTest from "../../components/ColorTest/ColorTest";
import WebcamFeed from "../../components/WebcamCapture/WebcamFeed";
import { eventBus } from "../../utils/eventBus";


const Usertest = () => {
  const [socket, setSocket] = useState(null);
  const [score, setScore] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [result, setResult] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const [response, setResponse] = useState("");

  

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/stream/text/");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Received from backend:", response);

      if (response.type === "text_response") {
        const jsonString = response.response.match(/\{[\s\S]*\}/)[0];
        const parsedResult = JSON.parse(jsonString);
        setResult(parsedResult);
        setOpenDialog(true);
      }
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
        query: {
          text: `The user has scored ${score} out of 20 on the Landolt C test. Provide advice in the following structured format: { "score": ${score}, "interpretation": "...", "advice": "...", "recommendation": "..." }`,
        },
      });
      socket.send(message);
      console.log("Sent to backend:", message);
    }
  };

useEffect(() => {
  const handleResponseUpdate = (newResponse) => {
    console.log("Response value:", newResponse);
    setResponse(newResponse); // Update state with the new response
  };

  // Subscribe to the event
  eventBus.on("response", handleResponseUpdate);

  // Cleanup the event listener when the component unmounts
  return () => {
    eventBus.off("response", handleResponseUpdate);
  };
}, []); 
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };



  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
      <AppBar position="static" sx={{ backgroundColor: "#0D1B2A", padding: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          >
            Back to Home
          </Button>
          <Typography variant="h4" sx={{ color: "#E0E1DD", fontWeight: "bold", flexGrow: 1, textAlign: "center" }}>
            Eye Test
          </Typography>
           <Box
                      sx={{
                        position: "absolute",
                        top: 80,
                        right: 20,
                        width: 200,
                      }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Response"
                        value={response}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
        </Toolbar>
      </AppBar>

      {/* Tabs for switching between tests */}
      <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
        <Tab label="Landolt Test" />
        <Tab label="Color Blindness Test" />
      </Tabs>

      <Container
  maxWidth="sm"
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    marginTop: 2,
    position: "relative",
  }}
>
  {tabIndex === 0 && (
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
        Please close one eye while taking the test !
      </Typography>
    </Box>
  )}
  {tabIndex === 0 ? <LandoltTest onScoreChange={setScore} /> : <ColorBlindnessTest />}
  {tabIndex === 0 && (
    <Button variant="contained" onClick={handleSend} sx={{ marginTop: 5 }}>
      Get Report
    </Button>
  )}
</Container>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Test Results</DialogTitle>
        <DialogContent>
          {result && (
            <>
              <DialogContentText>
                <strong>Score:</strong> {result.score}/20
              </DialogContentText>
              <DialogContentText>
                <strong>Interpretation:</strong> {result.interpretation}
              </DialogContentText>
              <DialogContentText>
                <strong>Advice:</strong> {result.advice}
              </DialogContentText>
              <DialogContentText>
                <strong>Recommendation:</strong> {result.recommendation}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
           <WebcamFeed />
    </Box>
  );
};

export default Usertest;
