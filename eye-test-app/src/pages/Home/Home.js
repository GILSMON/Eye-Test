import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
//import homePageImage from "../../assets/images/home_page_image.jpg"
import homePageImage from "../../assets/images/woman-eye.jpg"

import { Box ,Typography} from "@mui/material";
import EyeTestCard from "../../components/EyeTestCard/EyeTestCard";




const Home = () => {
  const navigate = useNavigate();
  const handleStartTest = () => {
    
    console.log("Eye Test Started"); // Replace with navigation logic
    navigate("/user"); 
  };
  return (
    <div>
      <Navbar />
      {/* Background Image Container */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <Box
          component="img"
          src={homePageImage}
          alt="Eye Test"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />

        {/* Eye Care Text (Outside Card) */}
        <Typography
          variant="body1"
          sx={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            color: "white",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 1.5,
            backdropFilter: "blur(5px)",
            
            padding: "10px 20px",
            borderRadius: "8px",
          }}
        >
          Your eyes work tirelessly every day, yet we often take them for granted.  
          Regular eye tests help detect issues early, ensuring long-term vision health.  
          Protecting your eyes from screens, UV rays, and strain is essential for clarity.  
          Take a quick test now and give your vision the care it deserves.
        </Typography>

        {/* Eye Test Card (Only Button Inside) */}
        <EyeTestCard onStartTest={handleStartTest} />
      </Box>
    </div>
  );
};

export default Home;