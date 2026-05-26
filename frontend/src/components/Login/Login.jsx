import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert
} from '@mui/material';

const Login = ({ setCurrentUser }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email,
            password
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {

        setCurrentUser(data.user);

        navigate(
          data.user.role === 'admin'
            ? '/admin/dashboard'
            : '/home'
        );

      } else {

        setError(data.message || 'Invalid credentials');

      }

    } catch {

      setError('Server connection failed.');

    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ mt: 8 }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Login
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >

        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
        >
          Submit
        </Button>

      </Box>

      <Typography sx={{ mt: 2 }}>

        <Link to="/signup">
          Not a Registered User?
        </Link>

      </Typography>

    </Container>
  );
};

export default Login;