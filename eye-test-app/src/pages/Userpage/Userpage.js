import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Box,
  TextField,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import WebcamFeed from "../../components/WebcamCapture/WebcamFeed";
import { eventBus } from "../../utils/eventBus";

const UserPage = () => {
  const [userName, setUserName] = useState("");
  const [response, setResponse] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();
  const blinkcount = response.split("Blinks:")[1];

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName || "User");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const handleResponseUpdate = (newResponse) => {
      console.log("Response value:", newResponse);
      setResponse(newResponse);
      if (isExerciseActive) {
        if (newResponse === "Hand cover both eyes") {
          setWarning("");
          if (isTimerPaused) {
            setIsTimerPaused(false);
          }
        } else {
          setWarning("Please keep your hands over your eyes (Palming)");
          setIsTimerPaused(true);
        }
      }
    };

    eventBus.on("response", handleResponseUpdate);
    return () => {
      eventBus.off("response", handleResponseUpdate);
    };
  }, [isExerciseActive, isTimerPaused]);

  useEffect(() => {
    let interval;
    if (isExerciseActive && !isTimerPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsExerciseActive(false);
      setExerciseCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isExerciseActive, isTimerPaused, timer]);

  const startExercise = () => {
    setIsExerciseActive(true);
    setTimer(60);
    setIsTimerPaused(false);
    setExerciseCompleted(false);
    setWarning("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#0D1B2A", padding: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#E0E1DD", fontWeight: "bold" }}>
            Welcome {userName}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/eyetest")} sx={{ mt: 3 }}>
            Take an Eye Test
          </Button>
          <Button variant="contained" color="secondary" onClick={() => navigate("/")} sx={{ mt: 3 }}>
            Logout
          </Button>
          <Box sx={{ position: "absolute", top: 80, right: 20, width: 200 }}>
            <TextField fullWidth variant="outlined" label="Response" value={response} InputProps={{ readOnly: true }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", mt: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Palming" />
          <Tab label="Blinking" />
        </Tabs>
      </Box>

      <Container maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ padding: 3, width: "100%", textAlign: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Palming Instructions
            </Typography>
            <Typography variant="body1">
              Place your palms gently over your eyes, ensuring no pressure is applied. Keep your eyes closed and relax for 1 minute.
            </Typography>
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper elevation={3} sx={{ padding: 3, width: "100%", textAlign: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Blinking Instructions
            </Typography>
            <Typography variant="body1">
            Blink your eyes 20 times to refresh and relax them.
            </Typography>
            <TextField
  fullWidth
  variant="outlined"
  label="Blink Count"
  value={`Blink Count = ${response.split("Blinks: ")[1] || 0}`}
  InputProps={{ readOnly: true }}
  sx={{ marginTop: 2 }}
/>
          </Paper>
        )}

        {tabValue === 0 && (
          <Box sx={{ mt: 4, textAlign: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Palming Exercise
            </Typography>
            {!isExerciseActive && !exerciseCompleted && (
              <Button variant="contained" onClick={startExercise}>
                Start Exercise
              </Button>
            )}
            {isExerciseActive && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Cover both eyes gently with your hands.
                </Typography>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Time Remaining: {timer} seconds
                </Typography>
                {warning && <Alert severity="error" sx={{ mt: 2 }}>{warning}</Alert>}
                <Button variant="contained" sx={{ mt: 2 }} onClick={startExercise}>
                  Reset timer
                </Button>
              </>
            )}
          </Box>
        )}
        <WebcamFeed />
      </Container>
    </Box>
  );
};

export default UserPage;
