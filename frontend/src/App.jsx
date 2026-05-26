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

const App = () => {

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  return (
    <>
      <CssBaseline />

      <Navbar
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <Box sx={{ p: 3 }}>

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
    </>
  );
};

export default App;