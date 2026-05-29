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
  MenuItem,
  Chip,
  Autocomplete
} from '@mui/material';

const GENRES = [
  "Fiction","Fantasy","Science Fiction","Mystery","Thriller",
  "Romance","Horror","Adventure","Crime","Drama","Comedy",
  "Historical Fiction","Dystopian","Magical Realism","Graphic Novel",
  "Short Stories","Young Adult","Children's","Non-Fiction","Biography",
  "Autobiography","Memoir","History","Philosophy","Psychology",
  "Self-Help","Personal Development","Politics","Economics","Business",
  "Entrepreneurship","Finance & Investing","Law","Science","Mathematics",
  "Technology","Engineering","Medicine & Health","Nutrition & Diet",
  "Fitness & Sports","Travel","Nature & Environment","Art & Design",
  "Music","Film & Media","Photography","Architecture","Cooking & Food",
  "Parenting","Education","Language & Linguistics","Religion",
  "Spirituality","Mythology","True Crime","Journalism","Essays",
  "Poetry","Comics & Manga"
];

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchBooks = async () => {
    const data = await (
      await fetch('http://localhost:5000/api/books')
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editing.title,
          author: editing.author,
          genre: editing.genre,
          description: editing.description,
          price: Number(editing.price),
          coverImage: editing.coverImage,
          isbn: editing.isbn || '',
          publicationYear: editing.publicationYear
            ? Number(editing.publicationYear)
            : null,
          isAvailable: editing.isAvailable
        })
      }
    );

    if (res.ok) {
      alert('Book updated successfully');
      setEditing(null);
      fetchBooks();
    } else {
      alert('Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Book deleted');
      fetchBooks();
    } else {
      alert('Failed to delete book');
    }
  };

  const getAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 'No ratings';
    const avg = ratings.reduce((a, b) => a + b.value, 0) / ratings.length;
    return `⭐ ${avg.toFixed(1)} (${ratings.length})`;
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/admin/addbook"
        sx={{ mb: 3 }}
      >
        + Add Book
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cover</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book._id}>
              <TableCell>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  width="50"
                  height="75"
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.isbn || '-'}</TableCell>
              <TableCell>{book.publicationYear || '-'}</TableCell>
              <TableCell>₹ {book.price}</TableCell>
              <TableCell>{getAverageRating(book.ratings)}</TableCell>
              <TableCell>❤️ {book.likes}</TableCell>
              <TableCell>
                <Chip
                  label={book.isAvailable ? 'Available' : 'Rented'}
                  color={book.isAvailable ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button size="small" onClick={() => setEditing({ ...book })}>
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(book._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Edit Book</Typography>

          {editing && (
            <>
              <TextField label="Book ID" value={editing._id} disabled />

              <TextField
                label="Title"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />

              <TextField
                label="Author"
                value={editing.author}
                onChange={(e) =>
                  setEditing({ ...editing, author: e.target.value })
                }
              />

              <Autocomplete
                options={GENRES}
                value={editing.genre || null}
                onChange={(e, newValue) =>
                  setEditing({ ...editing, genre: newValue || '' })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genre"
                    placeholder="Type to search genres..."
                  />
                )}
              />

              <TextField
                label="Price (₹)"
                type="number"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: e.target.value })
                }
              />

              <TextField
                label="ISBN"
                value={editing.isbn || ''}
                onChange={(e) =>
                  setEditing({ ...editing, isbn: e.target.value })
                }
              />

              <TextField
                label="Publication Year"
                type="number"
                value={editing.publicationYear || ''}
                onChange={(e) =>
                  setEditing({ ...editing, publicationYear: e.target.value })
                }
              />

              <TextField
                label="Cover Image URL"
                value={editing.coverImage}
                onChange={(e) =>
                  setEditing({ ...editing, coverImage: e.target.value })
                }
              />

              <TextField
                label="Description"
                multiline
                rows={4}
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={editing.isAvailable}
                  label="Availability"
                  onChange={(e) =>
                    setEditing({ ...editing, isAvailable: e.target.value })
                  }
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Rented</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleUpdate}>
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;