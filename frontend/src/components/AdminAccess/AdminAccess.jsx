import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container
} from '@mui/material'

const AdminAccess = () => {

  const [users, setUsers] = useState([
    { id: 1, name: 'Aparna', blocked: false },
    { id: 2, name: 'Rahul', blocked: false },
    { id: 3, name: 'Anjali', blocked: true },
    { id: 4, name: 'Arjun', blocked: false }
  ]);

  const handleBlock = (id) => {

    const updatedUsers = users.map((user) =>  // maps loops through all users,creating a new updated array
      user.id === id
        ? { ...user, blocked: !user.blocked } 
        : user
    );

    setUsers(updatedUsers); //updates state
  };

  const handleDelete = (id) => {

    const filteredUsers = users.filter((user) => user.id !== id);

    setUsers(filteredUsers);
  };

  return (

    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        py: 5
      }}
    >

      <Container>

        <Paper elevation={8} sx={{ p: 4, borderRadius: 5 }}>

          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Admin Access
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Manage all library users
          </Typography>

          <TableContainer component={Paper} elevation={3}>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell><b>User ID</b></TableCell>

                  <TableCell><b>User Name</b></TableCell>

                  <TableCell><b>Status</b></TableCell>

                  <TableCell align="center"><b>Actions</b></TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {
                  users.map((user) => (

                    <TableRow key={user.id}>

                      <TableCell>{user.id}</TableCell>

                      <TableCell>{user.name}</TableCell>

                      <TableCell>
                        {user.blocked ? 'Blocked' : 'Active'}
                      </TableCell>

                      <TableCell align="center">

                        <Button
                          variant="contained"
                          color={user.blocked ? 'success' : 'warning'}
                          sx={{ mr: 2 }}
                          onClick={() => handleBlock(user.id)}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>

                      </TableCell>

                    </TableRow>
                  ))
                }

              </TableBody>

            </Table>

          </TableContainer>

        </Paper>

      </Container>

    </Box>
  )
}

export default AdminAccess