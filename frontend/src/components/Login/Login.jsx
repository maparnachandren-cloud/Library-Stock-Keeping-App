import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress
} from '@mui/material';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
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
      setError(
        'Server connection failed. Make sure backend is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 2.5, md: 3 },
          borderRadius: 5,
          backdropFilter: 'blur(10px)',
          background: 'rgba(20, 20, 50, 0.65)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <MenuBookIcon
            sx={{
              fontSize: 45,
              color: '#ff8800',
              mb: 1,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#fff',
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            sx={{
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            Log in to access your library
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon
                    sx={{
                      color: '#e8a04b',
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon
                    sx={{
                      color: '#e8a04b',
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
            size="large"
            startIcon={
              submitting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : null
            }
            sx={{
              py: 1.2,
              borderRadius: 10,
              fontWeight: 600,
              bgcolor: '#ff5900',
              '&:hover': {
                bgcolor: '#402d0f',
              },
            }}
          >
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </Box>

        <Typography
          sx={{
            mt: 3,
            textAlign: 'center',
            color: '#fff',
          }}
        >
          Not a Registered User?{' '}
          <Link
            to="/signup"
            style={{
              color: '#e8a04b',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;