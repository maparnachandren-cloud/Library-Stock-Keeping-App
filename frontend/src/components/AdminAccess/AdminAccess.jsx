import { useState, useEffect } from 'react';
import { Container, Typography, Button, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function AdminAccess() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    setUsers(await (await fetch('http://localhost:5000/api/users')).json());
    setRequests(await (await fetch('http://localhost:5000/api/requests')).json());
  };
  useEffect(() => { fetchData(); }, []);

  const updateReq = async (reqId, bookId, status) => {
    await fetch(`http://localhost:5000/api/requests/${reqId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status, bookId }) });
    fetchData();
  };
  const toggleBlock = async (id, isBlocked) => {
    await fetch(`http://localhost:5000/api/users/${id}/block`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ isBlocked: !isBlocked }) });
    fetchData();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Access</Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Requests" />
        <Tab label="Users" />
      </Tabs>
      
      {tab === 0 && (
        <Table>
          <TableHead><TableRow><TableCell>Student</TableCell><TableCell>Book</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {requests.map(req => (
              <TableRow key={req._id}>
                <TableCell>{req.userId?.name}</TableCell><TableCell>{req.bookId?.title}</TableCell><TableCell>{req.status}</TableCell>
                <TableCell>
                  {req.status === 'Pending' && <><Button onClick={() => updateReq(req._id, req.bookId._id, 'Approved')}>Approve</Button> <Button onClick={() => updateReq(req._id, req.bookId._id, 'Rejected')}>Reject</Button></>}
                  {req.status === 'Approved' && <Button onClick={() => updateReq(req._id, req.bookId._id, 'Returned')}>Returned</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {tab === 1 && (
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  <Button onClick={() => toggleBlock(user._id, user.isBlocked)}>{user.isBlocked ? 'Unblock' : 'Block'}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}

export default AdminAccess;