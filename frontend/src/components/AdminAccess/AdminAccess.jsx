import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Tabs, Tab,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Box, Alert
} from '@mui/material';

const AdminAccess = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/requests')
      ]);

      const usersData = await usersRes.json();
      const requestsData = await requestsRes.json();

      setUsers(usersData);
      setRequests(requestsData);
      setLoading(false);
    } catch {
      setFetchError('Failed to load data. Make sure backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateReq = async (reqId, bookId, status) => {
    if (!bookId) {
      alert('Cannot update — book data is missing.');
      return;
    }
    await fetch(`http://localhost:5000/api/requests/${reqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, bookId })
    });
    fetchData();
  };

  const toggleBlock = async (id, isBlocked) => {
    await fetch(`http://localhost:5000/api/users/${id}/block`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: !isBlocked })
    });
    fetchData();
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s account? This cannot be undone.`
    );
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert(`${name}'s account has been deleted.`);
      fetchData();
    } else {
      alert('Failed to delete user.');
    }
  };

  if (loading) {
    return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;
  }

  if (fetchError) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{fetchError}</Alert></Container>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Access</Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label={`Users (${users.length})`} />
        <Tab label={`Requests (${requests.length})`} />
      </Tabs>

      {/* USERS TAB */}
      {tab === 0 && (
        <Paper sx={{ mt: 3 }}>
          {users.length === 0 ? (
            <Typography sx={{ p: 3 }} color="text.secondary">No registered users yet.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Education</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.education}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBlocked ? 'Blocked' : 'Active'}
                        color={user.isBlocked ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained" size="small"
                          color={user.isBlocked ? 'success' : 'warning'}
                          onClick={() => toggleBlock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          variant="contained" size="small" color="error"
                          onClick={() => handleDelete(user._id, user.name)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      {/* REQUESTS TAB */}
      {tab === 1 && (
        <Paper sx={{ mt: 3 }}>
          {requests.length === 0 ? (
            <Typography sx={{ p: 3 }} color="text.secondary">No rental requests yet.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Book</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>{req.userId?.name || 'Deleted User'}</TableCell>
                    <TableCell>{req.userId?.email || '-'}</TableCell>
                    <TableCell>{req.bookId?.title || 'Deleted Book'}</TableCell>
                    <TableCell>
                      <Chip
                        label={req.status}
                        color={
                          req.status === 'Approved' ? 'success' :
                          req.status === 'Pending'  ? 'warning' :
                          req.status === 'Rejected' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {req.status === 'Pending' && (
                          <>
                            <Button
                              variant="contained" size="small" color="success"
                              onClick={() => updateReq(req._id, req.bookId?._id, 'Approved')}
                              disabled={!req.bookId?._id}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained" size="small" color="error"
                              onClick={() => updateReq(req._id, req.bookId?._id, 'Rejected')}
                              disabled={!req.bookId?._id}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <Button
                            variant="contained" size="small" color="warning"
                            onClick={() => updateReq(req._id, req.bookId?._id, 'Returned')}
                            disabled={!req.bookId?._id}
                          >
                            Returned
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AdminAccess;
