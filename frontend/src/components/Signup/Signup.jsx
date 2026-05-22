import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel
} from '@mui/material'

import { useNavigate } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    place: '',
    age: '',
    education: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleChange = (e) => {

    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSignup = () => {

    if (
      !formData.name ||
      !formData.email ||
      !formData.place ||
      !formData.age ||
      !formData.education ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.terms) {
      alert('Please accept Terms and Conditions');
      return;
    }

    alert('Account Created Successfully');
    navigate('/login');
  };

  return (

    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        py: 5
      }}
    >

      <Container maxWidth="sm">

        <Paper elevation={8} sx={{ p: 5, borderRadius: 5 }}>

          <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
            Signup
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Create your library account
          </Typography>

          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Place"
            name="place"
            margin="normal"
            value={formData.place}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Age"
            name="age"
            type="number"
            margin="normal"
            value={formData.age}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Education"
            name="education"
            margin="normal"
            value={formData.education}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Phone Number"
            name="phone"
            type="tel"
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <TextField
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
            }
            label="Terms and conditions (if book is not returned or damaged fine will be charged)"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, py: 1.5, borderRadius: 3, fontSize: '1rem', textTransform: 'none' }}
            onClick={handleSignup}
          >
            Signup
          </Button>

        </Paper>

      </Container>

    </Box>
  )
}

export default Signup