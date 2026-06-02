import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Container, Alert,
  FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';

// Place: letters, spaces, commas, hyphens
const isValidPlace = (val) => /^[a-zA-Z\s,\-.]+$/.test(val.trim());

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', phone: '', place: '',
    education: '', password: '', confirmPassword: '', termsAccepted: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.age || !formData.phone ||
        !formData.place || !formData.education || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Name — letters and spaces only
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError('Name should only contain letters');
      return;
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Age
    if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      setError('Age must be between 1 and 120');
      return;
    }

    // Phone — exactly 10 digits
    if (formData.phone.toString().length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Place — letters, spaces, commas, hyphens only
    if (!isValidPlace(formData.place)) {
      setError('Place should only contain letters, spaces, or hyphens');
      return;
    }

    // Password minimum length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Terms
    if (!formData.termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name, email: formData.email,
          age: formData.age, phone: formData.phone,
          place: formData.place, education: formData.education,
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
      setError('Connection failed. Make sure backend is running.');
    }
  };

 return (
  <Box
    sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: 4,
      px: 2,
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        p: 3,
        borderRadius: 5,
        backdropFilter: 'blur(12px)',
        background: 'rgba(10, 10, 40, 0.85)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#fff',
            mb: 1,
          }}
        >
          Join Nalanda Bookstore
        </Typography>

        <Typography
          sx={{
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          Create your account and start exploring books
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSignup}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
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
          type="number"
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

        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
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
      sx={{
        color: 'white',
        '&.Mui-checked': {
          color: '#ffffff',
        },
      }}
    />
  }
  label="If book is not returned or damaged, a fine will be charged."
  sx={{
    color: 'white',
  }}
/>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.3,
            borderRadius: 10,
            fontWeight: 600,
            bgcolor: '#ff5900',
            '&:hover': {
              bgcolor: '#402d0f',
            },
          }}
        >
          Create Account
        </Button>

        <Typography
          sx={{
            textAlign: 'center',
            color: '#fff',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#e8a04b',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  </Box>
);
};

export default Signup;
