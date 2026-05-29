import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Nalanda Bookstore
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>

          {/* Welcome page — not logged in */}
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

          {/* Login page */}
          {location.pathname === '/login' && (
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          )}

          {/* Signup page */}
          {location.pathname === '/signup' && (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}

          {/* User home */}
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

          {/* Book details */}
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

          {/* User profile */}
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

          {/* Admin dashboard */}
          {location.pathname === '/admin/dashboard' && (
            <>
              <Button color="inherit" component={Link} to="/admin/users">
                Manage Users
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* Admin users / access */}
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

          {/* Admin add book */}
          {location.pathname === '/admin/addbook' && (
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
