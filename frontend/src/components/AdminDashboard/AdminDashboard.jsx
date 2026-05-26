import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const AdminDashboard = () => {

  const [books, setBooks] = useState([]);

  const [editing, setEditing] = useState(null);

  const fetchBooks = async () => {

    const data = await (
      await fetch(
        'http://localhost:5000/api/books'
      )
    ).json();

    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleUpdate = async () => {

    const res = await fetch(

      `http://localhost:5000/api/books/${editing._id}`,

      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(editing)
      }
    );

    if (res.ok) {

      alert('Book updated successfully');

      setEditing(null);

      fetchBooks();

    } else {

      alert('Failed to update');

    }
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        'Delete this book?'
      );

    if (!confirmDelete) {
      return;
    }

    await fetch(

      `http://localhost:5000/api/books/${id}`,

      {
        method: 'DELETE'
      }
    );

    alert('Book deleted');

    fetchBooks();
  };

  return (

    <Container sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        gutterBottom
      >
        Admin Dashboard
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/admin/addbook"
        sx={{ mb: 3 }}
      >
        Add Book
      </Button>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>
              Book ID
            </TableCell>

            <TableCell>
              Cover
            </TableCell>

            <TableCell>
              Cover URL
            </TableCell>

            <TableCell>
              Title
            </TableCell>

            <TableCell>
              Author
            </TableCell>

            <TableCell>
              Genre
            </TableCell>

            <TableCell>
              Price
            </TableCell>

            <TableCell>
              Rating
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

          {books.map((book) => {

            const averageRating =

              book.ratings?.length

                ? (
                    book.ratings.reduce(
                      (a, b) => a + b.value,
                      0
                    ) /
                    book.ratings.length
                  ).toFixed(1)

                : 0;

            return (

              <TableRow key={book._id}>

                <TableCell>
                  {book._id}
                </TableCell>

                <TableCell>

                  <img
                    src={book.coverImage}
                    alt={book.title}
                    width="60"
                    height="90"
                    style={{
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                  />

                </TableCell>

                <TableCell
                  sx={{
                    maxWidth: 220,
                    wordBreak: 'break-word'
                  }}
                >
                  {book.coverImage}
                </TableCell>

                <TableCell>
                  {book.title}
                </TableCell>

                <TableCell>
                  {book.author}
                </TableCell>

                <TableCell>
                  {book.genre}
                </TableCell>

                <TableCell>
                  ₹ {book.price}
                </TableCell>

                <TableCell>
                  {averageRating} ⭐
                </TableCell>

                <TableCell>

                  {book.isAvailable
                    ? 'Available'
                    : 'Rented'}

                </TableCell>

                <TableCell>

                  <Button
                    onClick={() =>
                      setEditing(book)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    onClick={() =>
                      handleDelete(book._id)
                    }
                  >
                    Delete
                  </Button>

                </TableCell>

              </TableRow>
            );
          })}

        </TableBody>

      </Table>

      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        maxWidth="sm"
        fullWidth
      >

        <Box
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >

          <Typography variant="h5">
            Edit Book
          </Typography>

          {editing && (

            <>

              <TextField
                label="Book ID"
                value={editing._id}
                disabled
              />

              <TextField
                label="Title"
                value={editing.title}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    title: e.target.value
                  })
                }
              />

              <TextField
                label="Author"
                value={editing.author}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    author: e.target.value
                  })
                }
              />

              <FormControl fullWidth>

                <InputLabel>
                  Genre
                </InputLabel>

                <Select
                  value={editing.genre}
                  label="Genre"
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      genre: e.target.value
                    })
                  }
                >

                  <MenuItem value="Fiction">
                    Fiction
                  </MenuItem>

                  <MenuItem value="Fantasy">
                    Fantasy
                  </MenuItem>

                  <MenuItem value="Science Fiction">
                    Science Fiction
                  </MenuItem>

                  <MenuItem value="Mystery">
                    Mystery
                  </MenuItem>

                  <MenuItem value="Thriller">
                    Thriller
                  </MenuItem>

                  <MenuItem value="Romance">
                    Romance
                  </MenuItem>

                  <MenuItem value="Horror">
                    Horror
                  </MenuItem>

                  <MenuItem value="Biography">
                    Biography
                  </MenuItem>

                  <MenuItem value="History">
                    History
                  </MenuItem>

                  <MenuItem value="Education">
                    Education
                  </MenuItem>

                </Select>

              </FormControl>

              <TextField
                label="Price"
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    price: e.target.value
                  })
                }
              />

              <TextField
                label="Cover Image URL"
                value={editing.coverImage}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    coverImage: e.target.value
                  })
                }
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                value={editing.description}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    description: e.target.value
                  })
                }
              />

              <FormControl fullWidth>

                <InputLabel>
                  Availability
                </InputLabel>

                <Select
                  value={editing.isAvailable}
                  label="Availability"
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      isAvailable: e.target.value
                    })
                  }
                >

                  <MenuItem value={true}>
                    Available
                  </MenuItem>

                  <MenuItem value={false}>
                    Rented
                  </MenuItem>

                </Select>

              </FormControl>

              <Button
                variant="contained"
                onClick={handleUpdate}
              >
                Save Changes
              </Button>

            </>

          )}

        </Box>

      </Dialog>

    </Container>
  );
};

export default AdminDashboard;