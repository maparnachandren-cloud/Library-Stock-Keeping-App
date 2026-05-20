import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate, useLocation } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library and Stock App
          </Typography>
          <Button color="inherit" onClick={() => {

    if (isLoginPage) {
      navigate('/signup');
    }
    else if(isSignupPage){
      navigate('/login')
    }

    else {
      navigate('/login');
    }

  }}
>

          {
          isLoginPage
      ? "Signup"
      : isSignupPage
      ? "Login"
      : "Logout"
          }

            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar