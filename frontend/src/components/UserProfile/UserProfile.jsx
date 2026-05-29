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
  Paper,
  Chip
} from '@mui/material';

const UserProfile = ({ currentUser, setCurrentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    place: '',
    education: ''
  });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch user profile
    fetch(`http://localhost:5000/api/users/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          phone: data.phone || '',
          place: data.place || '',
          education: data.education || ''
        });
      });

    // Fetch user's requests
    fetchRequests();
  }, [currentUser._id]);

  const fetchRequests = () => {
    fetch(`http://localhost:5000/api/users/${currentUser._id}/requests`)
      .then((res) => res.json())
      .then(setRequests);
  };

  const handleUpdate = async () => {
    const res = await fetch(
      `http://localhost:5000/api/users/${currentUser._id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }
    );

    const updatedUser = await res.json();
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setEditMode(false);
  };

  const handleCancel = async (id) => {
    await fetch(`http://localhost:5000/api/requests/${id}`, {
      method: 'DELETE'
    });
    fetchRequests();
  };

  const handleReRequest = async (bookId) => {
    const res = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser._id,
        bookId
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Rent request submitted again!');
      fetchRequests();
    } else {
      alert(data.message || 'Failed to submit request');
    }
  };

  // Count only approved (currently rented) books
  const rentedCount = requests.filter((r) => r.status === 'Approved').length;

  const getStatusChipColor = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    if (status === 'Returned') return 'default';
    return 'default';
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {/* Rented count summary */}
      <Typography sx={{ mb: 2 }} color="text.secondary">
        Books Currently Rented:{' '}
        <strong>{rentedCount}</strong>
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        {!editMode ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><strong>Name:</strong> {formData.name}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Age:</strong> {formData.age}</Typography>
            <Typography><strong>Phone:</strong> {formData.phone}</Typography>
            <Typography><strong>Place:</strong> {formData.place}</Typography>
            <Typography><strong>Education:</strong> {formData.education}</Typography>
            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
              sx={{ width: 'fit-content' }}
            >
              Edit Profile
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Place"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            />
            <TextField
              label="Education"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleUpdate}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>
        My Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography color="text.secondary">No requests yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req._id}>
                <TableCell>{req.bookId?.title}</TableCell>
                <TableCell>{req.bookId?.author}</TableCell>
                <TableCell>
                  <Chip
                    label={req.status}
                    color={getStatusChipColor(req.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {req.status === 'Pending' && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancel(req._id)}
                    >
                      Cancel
                    </Button>
                  )}
                  {req.status === 'Rejected' && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleReRequest(req.bookId?._id)}
                    >
                      Re-request
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default UserProfile;
