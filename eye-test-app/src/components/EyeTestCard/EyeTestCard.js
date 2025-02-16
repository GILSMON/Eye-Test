import React from "react";
import { Card, CardContent, Button, Stack } from "@mui/material";

const EyeTestCard = ({ onStartTest, onStartExercise }) => {
  return (
    <Card
      sx={{
        width: "auto",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        backdropFilter: "blur(8px)",
        background: "rgba(0, 0, 0, 0.6)",
        borderRadius: 4,
        padding: "20px",
        transition: "backdrop-filter 1s ease-in-out",
        "&:hover": {
          backdropFilter: "blur(0px)",
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onStartTest}
            sx={{
              bgcolor: "#ff5722",
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            Test Your Eye
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onStartExercise}
            sx={{
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Start Exercising
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EyeTestCard;