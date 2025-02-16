import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { Container, TextField, Button, Typography, Box , Card, CardContent,} from "@mui/material";


const Login = () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      
    });
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        alert("Login successful!");

        navigate("/user");
      } catch (error) {
        alert("Invalid email or password.");
      }
    };
  

    
  
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ width: "100%", padding: 3, boxShadow: 5, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, bgcolor: "#1976D2", padding: 1.5, fontSize: "1rem" }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  };
  
  export default Login;