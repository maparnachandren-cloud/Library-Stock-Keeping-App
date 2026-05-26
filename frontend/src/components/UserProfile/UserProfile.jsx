import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function UserProfile({ currentUser, setCurrentUser }) {
  const [formData, setFormData] = useState({ name: currentUser.name, email: currentUser.email });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${currentUser._id}/requests`).then(res => res.json()).then(setRequests);
  }, [currentUser._id]);

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
    });
    if (res.ok) setCurrentUser(await res.json());
  };

  const handleCancel = async (id) => {
    await fetch(`http://localhost:5000/api/requests/${id}`, { method: 'DELETE' });
    setRequests(requests.filter(req => req._id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Profile</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        <TextField label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
        <Button variant="contained" onClick={handleUpdate}>Update Profile</Button>
      </Box>

      <Typography variant="h5" gutterBottom>Requests</Typography>
      <Table>
        <TableHead>
          <TableRow><TableCell>Book</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {requests.map(req => (
            <TableRow key={req._id}>
              <TableCell>{req.bookId?.title}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>
                {req.status === 'Pending' && <Button size="small" onClick={() => handleCancel(req._id)}>Cancel</Button>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default UserProfile;