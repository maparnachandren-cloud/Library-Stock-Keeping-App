import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper
} from '@mui/material'

import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = () => {

    if (
      formData.email === 'user@gmail.com' &&
      formData.password === 'user123'
    ) {
      navigate('/home');
    }

    else if (
      formData.email === 'admin@gmail.com' &&
      formData.password === 'admin123'
    ) {
      navigate('/admindashboard');
    }

    else {
      alert('Invalid Email or Password');
    }
  };

  return (

    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8'
      }}
    >

      <Container maxWidth="sm">

        <Paper elevation={8} sx={{ p: 5, borderRadius: 5 }}>

          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            Login
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Enter your credentials to access your account
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 4, py: 1.5, borderRadius: 3, fontSize: '1rem', textTransform: 'none' }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography align="center" sx={{ mt: 4 }}>
            Not a registered user?{' '}
            <Link component="button" variant="body1" underline="hover" onClick={() => navigate('/signup')}>
              Signup
            </Link>
          </Typography>

        </Paper>

      </Container>

    </Box>
  )
}

export default Login