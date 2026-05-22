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
  const isAdminDashboard = location.pathname === '/admindashboard';
  const isHomePage = location.pathname === '/home';
  const isBookDetailsPage = location.pathname === '/bookdetails';
  const isAddBookPage = location.pathname === '/addbook';
  const isProfilePage = location.pathname === '/userprofile';
  const isAdminAccessPage = location.pathname === '/adminaccess';

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

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Library and Stock App
          </Typography>

          {
            isHomePage && (
              <Button
                color="inherit"
                onClick={() => navigate('/userprofile')}
              >
                My Profile
              </Button>
            )
          }

          {
            isAdminDashboard && (
              <Button
                color="inherit"
                onClick={() => navigate('/adminaccess')}
              >
                Admin Access
              </Button>
            )
          }

          {
            isBookDetailsPage && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/home')}
                >
                  Home
                </Button>

                <Button
                  color="inherit"
                  onClick={() => navigate('/userprofile')}
                >
                  My Profile
                </Button>
              </>
            )
          }

          {
            isAddBookPage && (
              <Button
                color="inherit"
                onClick={() => navigate('/admindashboard')}
              >
                Admin Dashboard
              </Button>
            )
          }

          {
            isProfilePage && (
              <Button
                color="inherit"
                onClick={() => navigate('/home')}
              >
                Home
              </Button>
            )
          }

          {
            isAdminAccessPage && (
              <Button
                color="inherit"
                onClick={() => navigate('/admindashboard')}
              >
                Admin Dashboard
              </Button>
            )
          }

          {
            isLoginPage && (
              <Button
                color="inherit"
                onClick={() => navigate('/signup')}
              >
                Signup
              </Button>
            )
          }

          {
            isSignupPage && (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )
          }

          {
            !isLoginPage && !isSignupPage && (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
              >
                Logout
              </Button>
            )
          }

        </Toolbar>

      </AppBar>

    </Box>
  )
}

export default Navbar