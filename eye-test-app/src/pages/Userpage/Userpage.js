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
  const [score, setScore] = useState(0);
  const [response, setResponse] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [exerciseStep, setExerciseStep] = useState(0); // Track exercise step
  const [timer, setTimer] = useState(0); // Timer for exercises
  const [isExerciseActive, setIsExerciseActive] = useState(false); // Track if exercise is active
  const [warning, setWarning] = useState(""); // Warnings for user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName || "User");
          } else {
            console.log("User document not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No authenticated user found");
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const handleResponseUpdate = (newResponse) => {
      console.log("Response value:", newResponse);
      setResponse(newResponse);

      // Check for warnings during exercise
      if (isExerciseActive) {
        if (exerciseStep === 0 && newResponse !== "Both Eyes Closed") {
          setWarning("Please keep both eyes closed!");
        } else if (exerciseStep === 1 && newResponse !== "Eyes Open") {
          setWarning("Please keep your eyes open and blink rapidly!");
        }
      }
    };

    eventBus.on("response", handleResponseUpdate);

    return () => {
      eventBus.off("response", handleResponseUpdate);
    };
  }, [isExerciseActive, exerciseStep]);

  useEffect(() => {
    let interval;
    if (isExerciseActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isExerciseActive) {
      setIsExerciseActive(false);
      setWarning("");
      if (exerciseStep === 0) {
        setExerciseStep(1); // Move to next exercise
      } else {
        setExerciseStep(0); // Reset to first exercise
      }
    }

    return () => clearInterval(interval);
  }, [isExerciseActive, timer, exerciseStep]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTest = async () => {
    try {
      navigate("/eyetest");
    } catch (error) {
      console.error("Error in moving to test page", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const startExercise = () => {
    setIsExerciseActive(true);
    setTimer(60); // Set timer for 1 minute
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
      {/* Top Score Bar */}
      <AppBar position="static" sx={{ backgroundColor: "#0D1B2A", padding: 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "#E0E1DD", fontWeight: "bold" }}>
            Welcome {userName}
          </Typography>
          <Typography variant="h6" sx={{ color: "#E0E1DD" }}>
            <Button variant="contained" onClick={handleTest} sx={{ mt: 3 }}>
              Take an Eye Test
            </Button>
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ mt: 3 }}
          >
            Logout
          </Button>
          {/* Response Text Box */}
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

      {/* Tabs for Palming and Blinking */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ backgroundColor: "#FFFFFF" }}
        >
          <Tab label="Palming" />
          <Tab label="Blinking" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          mt: 4,
        }}
      >
        {/* Display instructions based on the selected tab */}
        {tabValue === 0 && (
          <Paper
            elevation={3}
            sx={{ padding: 3, width: "100%", textAlign: "center", mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Palming Instructions
            </Typography>
            <Typography variant="body1">
              Place your palms gently over your eyes, ensuring no pressure is
              applied. Keep your eyes closed and relax for 1-2 minutes. This
              helps reduce eye strain and improve blood circulation.
            </Typography>
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper
            elevation={3}
            sx={{ padding: 3, width: "100%", textAlign: "center", mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Blinking Instructions
            </Typography>
            <Typography variant="body1">
              Blink your eyes rapidly for 10-15 seconds, then close them and
              relax for 10 seconds. Repeat this process 5-10 times. Blinking
              helps keep your eyes moist and reduces dryness.
            </Typography>
          </Paper>
        )}

        {/* Exercise Section */}
        {tabValue === 1 && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Blinking Exercise
            </Typography>
            {!isExerciseActive ? (
              <Button variant="contained" onClick={startExercise}>
                Start Exercise
              </Button>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {exerciseStep === 0
                    ? "Close both eyes for 1 minute."
                    : "Blink rapidly for 10 seconds."}
                </Typography>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Time Remaining: {timer} seconds
                </Typography>
                {warning && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {warning}
                  </Alert>
                )}
              </>
            )}
          </Box>
        )}

        {/* Webcam Feed */}
        <WebcamFeed />
      </Container>
    </Box>
  );
};

export default UserPage;