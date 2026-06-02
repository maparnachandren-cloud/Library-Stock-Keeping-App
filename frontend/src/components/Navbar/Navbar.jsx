import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const navButtonStyle = {
  borderRadius: '20px',
  px: 2,
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: 'rgb(255, 255, 255)',
    backdropFilter: 'blur(10px)',
    transform: 'translateY(-2px)',
  },
};

const Navbar = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (!currentUser) {
      navigate('/');
    } else if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        backgroundImage: 'none',
      }}
    >
      <Toolbar sx={{ py: 0.5 }}>
        {/* Logo & Title */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <MenuBookIcon
            sx={{
              fontSize: 28,
              color: '#ff8800',
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '1.3rem',
              color: '#fff',
              textShadow: '0 2px 10px rgba(255,255,255,0.3)',
            }}
          >
            Nalanda Bookstore
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>

          {location.pathname === '/' && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              Login
            </Button>
          )}

          {location.pathname === '/login' && (
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              sx={navButtonStyle}
            >
              Signup
            </Button>
          )}

          {location.pathname === '/signup' && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              Login
            </Button>
          )}

          {location.pathname === '/home' && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                sx={navButtonStyle}
              >
                My Profile
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}

          {location.pathname.startsWith('/book/') && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/home"
                sx={navButtonStyle}
              >
                Home
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/profile"
                sx={navButtonStyle}
              >
                My Profile
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}

          {location.pathname === '/profile' && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/home"
                sx={navButtonStyle}
              >
                Home
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}

          {location.pathname === '/admin/dashboard' && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/admin/users"
                sx={navButtonStyle}
              >
                Manage Users
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/admin/addbook"
                sx={navButtonStyle}
              >
                Add Book
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}

          {location.pathname === '/admin/users' && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/admin/dashboard"
                sx={navButtonStyle}
              >
                Dashboard
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/admin/addbook"
                sx={navButtonStyle}
              >
                Add Book
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                Logout
              </Button>
            </>
          )}

          {location.pathname === '/admin/addbook' && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/admin/dashboard"
                sx={navButtonStyle}
              >
                Dashboard
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/admin/users"
                sx={navButtonStyle}
              >
                Manage Users
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
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