import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    place: '',
    education: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.age ||
      !formData.phone ||
      !formData.place ||
      !formData.education ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: formData.age,
          phone: formData.phone,
          place: formData.place,
          education: formData.education,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Account created successfully');
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch {
      setError('Connection failed');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSignup}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Name"
          name="name"
          required
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          required
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />

        <TextField
          label="Age"
          name="age"
          type="number"
          required
          fullWidth
          value={formData.age}
          onChange={handleChange}
        />

        <TextField
          label="Phone Number"
          name="phone"
          required
          fullWidth
          value={formData.phone}
          onChange={handleChange}
        />

        <TextField
          label="Place"
          name="place"
          required
          fullWidth
          value={formData.place}
          onChange={handleChange}
        />

        <FormControl fullWidth required>
          <InputLabel>Education</InputLabel>
          <Select
            name="education"
            value={formData.education}
            label="Education"
            onChange={handleChange}
          >
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Medicine">Medicine</MenuItem>
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>

        {/* Password is dotted */}
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />

        {/* Confirm Password is visible so user can verify */}
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="text"
          required
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
          }
          label="If book is not returned or damaged, a fine will be charged."
        />

        <Button type="submit" variant="contained" fullWidth>
          Signup
        </Button>

        <Typography>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
