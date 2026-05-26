import { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const UserProfile = ({
  currentUser,
  setCurrentUser
}) => {

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    education: ''
  });

  const [requests, setRequests] = useState([]);

  useEffect(() => {

    fetch(
      `http://localhost:5000/api/users/${currentUser._id}`
    )
      .then((res) => res.json())
      .then((data) => {

        setFormData({
          name: data.name,
          email: data.email,
          age: data.age,
          phone: data.phone,
          education: data.education
        });
      });

    fetch(
      `http://localhost:5000/api/users/${currentUser._id}/requests`
    )
      .then((res) => res.json())
      .then(setRequests);

  }, [currentUser._id]);



  const handleUpdate = async () => {

    const res = await fetch(
      `http://localhost:5000/api/users/${currentUser._id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)
      }
    );

    const updatedUser = await res.json();

    setCurrentUser(updatedUser);

    localStorage.setItem(
      'currentUser',
      JSON.stringify(updatedUser)
    );

    setEditMode(false);
  };



  const handleCancel = async (id) => {

    await fetch(
      `http://localhost:5000/api/requests/${id}`,
      {
        method: 'DELETE'
      }
    );

    setRequests(
      requests.filter(
        (req) => req._id !== id
      )
    );
  };



  return (
    <Container sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        My Profile
      </Typography>



      <Paper sx={{ p: 3, mb: 4 }}>

        {!editMode ? (

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >

            <Typography>
              <strong>Name:</strong> {formData.name}
            </Typography>

            <Typography>
              <strong>Email:</strong> {formData.email}
            </Typography>

            <Typography>
              <strong>Age:</strong> {formData.age}
            </Typography>

            <Typography>
              <strong>Phone:</strong> {formData.phone}
            </Typography>

            <Typography>
              <strong>Education:</strong> {formData.education}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>

          </Box>

        ) : (

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >

            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />

            <TextField
              label="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: e.target.value
                })
              }
            />

            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value
                })
              }
            />

            <TextField
              label="Education"
              value={formData.education}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  education: e.target.value
                })
              }
            />

            <Box
              sx={{
                display: 'flex',
                gap: 2
              }}
            >

              <Button
                variant="contained"
                onClick={handleUpdate}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>

            </Box>

          </Box>

        )}

      </Paper>



      <Typography
        variant="h5"
        gutterBottom
      >
        Requests
      </Typography>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>
              Book
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell>
              Action
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {requests.map((req) => (

            <TableRow key={req._id}>

              <TableCell>
                {req.bookId?.title}
              </TableCell>

              <TableCell>
                {req.status}
              </TableCell>

              <TableCell>

                {req.status === 'Pending' && (

                  <Button
                    size="small"
                    onClick={() =>
                      handleCancel(req._id)
                    }
                  >
                    Cancel
                  </Button>

                )}

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Container>
  );
};

export default UserProfile;