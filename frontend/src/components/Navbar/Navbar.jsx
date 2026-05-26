import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const getLogoLink = () => {
    if (!currentUser) return '/';

    return currentUser.role === 'admin'
      ? '/admin/dashboard'
      : '/home';
  };

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography
          variant="h6"
          component={Link}
          to={getLogoLink()}
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Library System
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>

          {currentUser ? (
            <>
              {currentUser.role === 'admin' ? (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/dashboard"
                  >
                    Inventory
                  </Button>

                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/users"
                  >
                    Access
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/home"
                  >
                    Catalog
                  </Button>

                  <Button
                    color="inherit"
                    component={Link}
                    to="/profile"
                  >
                    Profile
                  </Button>
                </>
              )}

              <Button
                color="inherit"
                onClick={() => {
                  setCurrentUser(null);
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>

              <Button
                color="inherit"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;