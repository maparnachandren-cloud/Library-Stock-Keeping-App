import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

const Navbar = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Nalanda Bookstore
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>

          {/* HOME (Guest) */}
          {location.pathname === '/' && (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>

              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}

          {/* LOGIN PAGE */}
          {location.pathname === '/login' && (
            <>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>

              {/* NEW: Welcome link */}
              <Button color="inherit" component={Link} to="/welcome">
                Welcome
              </Button>
            </>
          )}

          {/* SIGNUP PAGE */}
          {location.pathname === '/signup' && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}

          {/* HOME PAGE (LOGGED IN USER) */}
          {location.pathname === '/home' && (
            <>
              <Button color="inherit" component={Link} to="/profile">
                My Profile
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* BOOK DETAILS */}
          {location.pathname.startsWith('/book/') && (
            <>
              <Button color="inherit" component={Link} to="/home">
                Home
              </Button>

              <Button color="inherit" component={Link} to="/profile">
                My Profile
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* PROFILE */}
          {location.pathname === '/profile' && (
            <>
              <Button color="inherit" component={Link} to="/home">
                Home
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* ADMIN DASHBOARD */}
          {location.pathname === '/admin/dashboard' && (
            <>
              <Button color="inherit" component={Link} to="/admin/users">
                Access
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* ADMIN USERS */}
          {location.pathname === '/admin/users' && (
            <>
              <Button color="inherit" component={Link} to="/admin/dashboard">
                Dashboard
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;