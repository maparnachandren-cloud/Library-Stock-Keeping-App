import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Alert
} from '@mui/material';

const UserProfile = ({ currentUser, setCurrentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', phone: '', place: '', education: ''
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
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

    fetchRequests();
  }, [currentUser._id]);

  const fetchRequests = () => {
    fetch(`http://localhost:5000/api/users/${currentUser._id}/requests`)
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  const handleUpdate = async () => {
    setError('');
    setSuccessMsg('');

    // Name — letters only
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError('Name should only contain letters');
      return;
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Age
    if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      setError('Age must be between 1 and 120');
      return;
    }

    // Phone — exactly 10 digits
    if (formData.phone.toString().length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Place — letters, spaces, commas, hyphens only
    if (!formData.place.trim() || !/^[a-zA-Z\s,\-.]+$/.test(formData.place.trim())) {
      setError('Place should only contain letters, spaces, or hyphens');
      return;
    }

    const res = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const updatedUser = await res.json();

    if (res.ok) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setEditMode(false);
      setSuccessMsg('Profile updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(updatedUser.message || 'Failed to update profile');
    }
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this request?');
    if (!confirmed) return;
    await fetch(`http://localhost:5000/api/requests/${id}`, { method: 'DELETE' });
    fetchRequests();
  };

  const handleReRequest = async (bookId) => {
    const res = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id, bookId })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Rent request submitted again!');
      fetchRequests();
    } else {
      alert(data.message || 'Failed to submit request');
    }
  };

  const rentedCount = requests.filter((r) => r.status === 'Approved').length;

  const getStatusChipColor = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'default';
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Typography sx={{ mb: 2 }} color="text.secondary">
        Books Currently Rented: <strong>{rentedCount}</strong>
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

      <Paper sx={{ p: 3, mb: 4 }}>
        {!editMode ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><strong>Name:</strong> {formData.name}</Typography>
            <Typography><strong>Email:</strong> {formData.email}</Typography>
            <Typography><strong>Age:</strong> {formData.age}</Typography>
            <Typography><strong>Phone:</strong> {formData.phone}</Typography>
            <Typography><strong>Place:</strong> {formData.place}</Typography>
            <Typography><strong>Education:</strong> {formData.education}</Typography>
            <Button variant="contained" onClick={() => setEditMode(true)} sx={{ width: 'fit-content' }}>
              Edit Profile
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="Letters only"
            />

            <TextField
              label="Email" type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              label="Age" type="number" value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              inputProps={{ min: 1, max: 120 }}
              helperText="Between 1 and 120"
            />

            <TextField
              label="Phone" type="number" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              inputProps={{ min: 1000000000, max: 9999999999 }}
              helperText="10 digit phone number"
            />

            <TextField
              label="Place" value={formData.place}
              helperText="Letters, spaces, hyphens only"
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            />

            <TextField
              label="Education" value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleUpdate}>Save</Button>
              <Button variant="outlined" onClick={() => { setEditMode(false); setError(''); }}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Typography variant="h5" gutterBottom>My Requests</Typography>

      {requests.length === 0 ? (
        <Typography color="text.secondary">No rental requests yet.</Typography>
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
                <TableCell>{req.bookId?.title || 'Book deleted'}</TableCell>
                <TableCell>{req.bookId?.author || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={req.status}
                    color={getStatusChipColor(req.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {req.status === 'Pending' && (
                    <Button size="small" color="error" onClick={() => handleCancel(req._id)}>
                      Cancel
                    </Button>
                  )}
                  {req.status === 'Rejected' && req.bookId?._id && (
                    <Button size="small" variant="contained"
                      onClick={() => handleReRequest(req.bookId._id)}>
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
