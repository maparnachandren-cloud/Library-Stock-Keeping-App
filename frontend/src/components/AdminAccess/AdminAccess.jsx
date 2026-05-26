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
  Paper
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

  const updateReq = async (
    reqId,
    bookId,
    status
  ) => {

    await fetch(
      `http://localhost:5000/api/requests/${reqId}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          status,
          bookId
        })
      }
    );

    fetchData();
  };

  const toggleBlock = async (
    id,
    isBlocked
  ) => {

    await fetch(
      `http://localhost:5000/api/users/${id}/block`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          isBlocked: !isBlocked
        })
      }
    );

    fetchData();
  };

  return (
    <Container sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Admin Access
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
      >

        <Tab label="Users" />

        <Tab label="Requests" />

      </Tabs>



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

                <TableCell>Action</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {users.map((user) => (

                <TableRow key={user._id}>

                  <TableCell>
                    {user.name}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    {user.age}
                  </TableCell>

                  <TableCell>
                    {user.phone}
                  </TableCell>

                  <TableCell>
                    {user.education}
                  </TableCell>

                  <TableCell>
                    {user.isBlocked
                      ? 'Blocked'
                      : 'Active'}
                  </TableCell>

                  <TableCell>

                    <Button
                      variant="contained"
                      color={
                        user.isBlocked
                          ? 'success'
                          : 'error'
                      }
                      onClick={() =>
                        toggleBlock(
                          user._id,
                          user.isBlocked
                        )
                      }
                    >
                      {user.isBlocked
                        ? 'Unblock'
                        : 'Block'}
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </Paper>

      )}



      {tab === 1 && (

        <Paper sx={{ mt: 3 }}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  Student
                </TableCell>

                <TableCell>
                  Book
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {requests.map((req) => (

                <TableRow key={req._id}>

                  <TableCell>
                    {req.userId?.name}
                  </TableCell>

                  <TableCell>
                    {req.bookId?.title}
                  </TableCell>

                  <TableCell>
                    {req.status}
                  </TableCell>

                  <TableCell>

                    {req.status === 'Pending' && (
                      <>
                        <Button
                          onClick={() =>
                            updateReq(
                              req._id,
                              req.bookId._id,
                              'Approved'
                            )
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          onClick={() =>
                            updateReq(
                              req._id,
                              req.bookId._id,
                              'Rejected'
                            )
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {req.status === 'Approved' && (

                      <Button
                        onClick={() =>
                          updateReq(
                            req._id,
                            req.bookId._id,
                            'Returned'
                          )
                        }
                      >
                        Returned
                      </Button>

                    )}

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