import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Button, Dialog, TextField, Box,
  FormControl, InputLabel, Select, MenuItem, Chip,
  Autocomplete, Alert
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

const currentYear = new Date().getFullYear();

const isValidAuthor = (val) => /^[a-zA-Z\s.\-']+$/.test(val.trim());
const isValidTitle  = (val) => /^[a-zA-Z0-9\s.,!?'\-:&()]+$/.test(val.trim());
const isValidISBN   = (val) => /^\d{10}$/.test(val) || /^\d{13}$/.test(val);

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editError, setEditError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchBooks = async () => {
    try {
      const data = await (await fetch('http://localhost:5000/api/books')).json();
      setBooks(data);
      setLoading(false);
    } catch {
      setFetchError('Failed to load books. Make sure backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleUpdate = async () => {
    setEditError('');

    if (!editing.title?.trim() || !editing.author?.trim() ||
        !editing.genre || !editing.description?.trim()) {
      setEditError('Title, author, genre and description are required');
      return;
    }

    if (!isValidTitle(editing.title)) {
      setEditError('Title contains invalid characters');
      return;
    }

    if (!isValidAuthor(editing.author)) {
      setEditError('Author name should only contain letters, spaces, dots, or hyphens');
      return;
    }

    if (editing.description.trim().length > 1000) {
      setEditError('Description cannot exceed 1000 characters');
      return;
    }

    if (Number(editing.price) <= 0) {
      setEditError('Price must be greater than 0');
      return;
    }

    if (editing.publicationYear) {
      const yr = Number(editing.publicationYear);
      if (!Number.isInteger(yr) || yr < 1450 || yr > currentYear) {
        setEditError(`Publication year must be a whole number between 1450 and ${currentYear}`);
        return;
      }
    }

    if (!editing.coverImage.startsWith('http://') && !editing.coverImage.startsWith('https://')) {
      setEditError('Cover image must be a valid URL starting with http:// or https://');
      return;
    }

    if (editing.isbn && editing.isbn.trim() && !isValidISBN(editing.isbn.trim())) {
      setEditError('ISBN must be exactly 10 or 13 digits');
      return;
    }

    const res = await fetch(`http://localhost:5000/api/books/${editing._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editing.title.trim(),
        author: editing.author.trim(),
        genre: editing.genre,
        description: editing.description.trim(),
        price: Number(editing.price),
        coverImage: editing.coverImage,
        isbn: editing.isbn || '',
        publicationYear: editing.publicationYear ? Number(editing.publicationYear) : null,
        isAvailable: editing.isAvailable
      })
    });

    if (res.ok) {
      alert('Book updated successfully');
      setEditing(null);
      setEditError('');
      fetchBooks();
    } else {
      const data = await res.json();
      setEditError(data.message || 'Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    const res = await fetch(`http://localhost:5000/api/books/${id}`, { method: 'DELETE' });
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

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Loading books...</Typography></Container>;
  if (fetchError) return <Container sx={{ mt: 4 }}><Alert severity="error">{fetchError}</Alert></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Button variant="contained" component={Link} to="/admin/addbook" sx={{ mb: 3 }}>
        + Add Book
      </Button>

      {books.length === 0 ? (
        <Typography color="text.secondary">
          No books added yet. Click + Add Book to get started.
        </Typography>
      ) : (
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
                    src={book.coverImage} alt={book.title}
                    width="50" height="75"
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50x75'; }}
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
                  <Button size="small"
                    onClick={() => { setEditing({ ...book }); setEditError(''); }}>
                    Edit
                  </Button>
                  <Button size="small" color="error"
                    onClick={() => handleDelete(book._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editing}
        onClose={() => { setEditing(null); setEditError(''); }}
        maxWidth="sm" fullWidth
      >
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5">Edit Book</Typography>

          {editError && <Alert severity="error">{editError}</Alert>}

          {editing && (
            <>
              <TextField label="Book ID" value={editing._id} disabled />

              <TextField
                label="Title" value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                helperText="Letters, numbers, basic punctuation only"
              />

              <TextField
                label="Author" value={editing.author}
                onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                helperText="Letters, spaces, dots, hyphens only"
              />

              <Autocomplete
                options={GENRES}
                value={editing.genre || null}
                onChange={(e, newValue) => setEditing({ ...editing, genre: newValue || '' })}
                renderInput={(params) => (
                  <TextField {...params} label="Genre" placeholder="Type to search..." />
                )}
              />

              <TextField
                label="Price (₹)" type="number" value={editing.price}
                onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                inputProps={{ min: 1, step: 1 }}
                helperText="Must be greater than 0"
              />

              <TextField
                label="ISBN" value={editing.isbn || ''}
                onChange={(e) => setEditing({ ...editing, isbn: e.target.value })}
                helperText="10 or 13 digits only (optional)"
                inputProps={{ maxLength: 13 }}
              />

              <TextField
                label="Publication Year" type="number"
                value={editing.publicationYear || ''}
                onChange={(e) => setEditing({ ...editing, publicationYear: e.target.value })}
                inputProps={{ min: 1450, max: currentYear, step: 1 }}
                helperText={`Whole number between 1450 and ${currentYear}`}
              />

              <TextField
                label="Cover Image URL" value={editing.coverImage}
                onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
                helperText="Must start with http:// or https://"
              />

              <TextField
                label="Description" multiline rows={4} value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                inputProps={{ maxLength: 1000 }}
                helperText={`${editing.description?.length || 0}/1000 characters`}
                error={editing.description?.length > 1000}
              />

              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={editing.isAvailable} label="Availability"
                  onChange={(e) => setEditing({ ...editing, isAvailable: e.target.value })}
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Rented</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                <Button variant="outlined"
                  onClick={() => { setEditing(null); setEditError(''); }}>
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
