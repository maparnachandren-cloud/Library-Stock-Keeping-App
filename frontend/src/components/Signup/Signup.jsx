import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      if (res.ok) { alert("Created!"); navigate('/login'); } 
      else setError((await res.json()).message || "Failed");
    } catch { setError("Connection failed"); }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Name" required fullWidth onChange={e => setFormData({...formData, name: e.target.value})} />
        <TextField label="Email" type="email" required fullWidth onChange={e => setFormData({...formData, email: e.target.value})} />
        <TextField label="Password" type="password" required fullWidth onChange={e => setFormData({...formData, password: e.target.value})} />
        <Button type="submit" variant="contained" fullWidth>Submit</Button>
      </Box>
      <Typography sx={{ mt: 2 }}><Link to="/login">Go to Login</Link></Typography>
    </Container>
  );
}

export default Signup;