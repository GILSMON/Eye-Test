import React from "react";
import { Box, TextField, Typography } from "@mui/material";

const Userexercise = () => {
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
      <TextField label="Enter something..." variant="outlined" />
    </Box>
  );
};

export default Userexercise;