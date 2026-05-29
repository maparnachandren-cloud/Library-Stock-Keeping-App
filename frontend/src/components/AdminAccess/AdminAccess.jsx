import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box
} from '@mui/material';

const AdminAccess = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    const usersData = await (
      await fetch('http://localhost:5000/api/users')
    ).json();

    const requestsData = await (
      await fetch('http://localhost:5000/api/requests')
    ).json();

    setUsers(usersData);
    setRequests(requestsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateReq = async (reqId, bookId, status) => {
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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Access
      </Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Users" />
        <Tab label="Requests" />
      </Tabs>

      {/* ── USERS TAB ── */}
      {tab === 0 && (
        <Paper sx={{ mt: 3 }}>
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
                      {/* Block / Unblock */}
                      <Button
                        variant="contained"
                        size="small"
                        color={user.isBlocked ? 'success' : 'warning'}
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
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
        </Paper>
      )}

      {/* ── REQUESTS TAB ── */}
      {tab === 1 && (
        <Paper sx={{ mt: 3 }}>
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
                  <TableCell>{req.userId?.name}</TableCell>
                  <TableCell>{req.userId?.email}</TableCell>
                  <TableCell>{req.bookId?.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={req.status}
                      color={
                        req.status === 'Approved' ? 'success' :
                        req.status === 'Pending'  ? 'warning' :
                        req.status === 'Rejected' ? 'error'   : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {req.status === 'Pending' && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              updateReq(req._id, req.bookId._id, 'Approved')
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() =>
                              updateReq(req._id, req.bookId._id, 'Rejected')
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {req.status === 'Approved' && (
                        <Button
                          variant="contained"
                          size="small"
                          color="warning"
                          onClick={() =>
                            updateReq(req._id, req.bookId._id, 'Returned')
                          }
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
        </Paper>
      )}
    </Container>
  );
};

export default AdminAccess;