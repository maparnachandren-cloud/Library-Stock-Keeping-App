import { useState } from 'react';

import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  CssBaseline,
  Box
} from '@mui/material';

import Navbar from './components/Navbar/Navbar';

import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

import Home from './components/Home/Home';
import BookDetails from './components/BookDetails/BookDetails';
import UserProfile from './components/UserProfile/UserProfile';

import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminAccess from './components/AdminAccess/AdminAccess';
import AddBook from './components/AddBook/AddBook';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary:   { main: '#1a3c5e', light: '#2a5f94', contrastText: '#fff' },
    secondary: { main: '#e8a04b', contrastText: '#1c1c1c' },
    background:{ default: '#f8f5f0', paper: '#ffffff' },
    success:   { main: '#2d7a4f' },
    error:     { main: '#c0392b' },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h6: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a3c5e 0%, #2a5f94 100%)',
          boxShadow: '0 4px 14px rgba(26,60,94,0.3)',
        },
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'linear-gradient(135deg, #1a3c5e, #0f2540)' }
      }
    }
  }
});

const App = () => {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Navbar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

     <Box sx={{ px: {xs:1.5,sm:2,md:3}, py:{xs:2,md:3} }}>

        <Routes>

          <Route
            path="/"
            element={<Welcome />}
          />

          <Route
            path="/login"
            element={
              <Login
                setCurrentUser={setCurrentUser}
              />
            }
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/home"
            element={
              currentUser
                ? <Home />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/book/:id"
            element={
              currentUser
                ? (
                  <BookDetails
                    currentUser={currentUser}
                  />
                )
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/profile"
            element={
              currentUser
                ? (
                  <UserProfile
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                  />
                )
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              currentUser?.role === 'admin'
                ? <AdminDashboard />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/users"
            element={
              currentUser?.role === 'admin'
                ? <AdminAccess />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/admin/addbook"
            element={
              currentUser?.role === 'admin'
                ? <AddBook />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </Box>
      </ThemeProvider>
    </>
  );
};

export default App;