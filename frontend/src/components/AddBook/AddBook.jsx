import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, TextField, Button, Autocomplete, Alert
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

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', author: '', genre: '', description: '',
    price: '', coverImage: '', isbn: '', publicationYear: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim() ||
        !formData.genre || !formData.description.trim() ||
        !formData.price || !formData.coverImage.trim()) {
      setError('All required fields must be filled');
      return;
    }
    if (!isValidTitle(formData.title)) {
      setError('Title contains invalid characters. Only letters, numbers, and basic punctuation allowed.');
      return;
    }
    if (!isValidAuthor(formData.author)) {
      setError('Author name should only contain letters, spaces, dots, or hyphens (e.g. J.K. Rowling)');
      return;
    }
    if (formData.description.trim().length > 1000) {
      setError('Description cannot exceed 1000 characters');
      return;
    }
    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (formData.publicationYear) {
      const yr = Number(formData.publicationYear);
      if (!Number.isInteger(yr) || yr < 1450 || yr > currentYear) {
        setError(`Publication year must be a whole number between 1450 and ${currentYear}`);
        return;
      }
    }
    if (!formData.coverImage.startsWith('http://') && !formData.coverImage.startsWith('https://')) {
      setError('Cover image must be a valid URL starting with http:// or https://');
      return;
    }
    if (formData.isbn.trim() && !isValidISBN(formData.isbn.trim())) {
      setError('ISBN must be exactly 10 or 13 digits (numbers only)');
      return;
    }

    const res = await fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        publicationYear: formData.publicationYear ? Number(formData.publicationYear) : null
      })
    });

    if (res.ok) {
      alert('Book added successfully');
      navigate('/admin/dashboard');
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to add book');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: '50px', mb: '50px' }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '#ffffff',
          fontWeight: 700,
          letterSpacing: '1px',
          mb: '10px',
        }}
      >
        Enter book details to add it to the bookstore inventory
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211,47,47,0.18)', color: '#ff8a80', border: '1px solid rgba(211,47,47,0.45)', borderRadius: '10px', fontWeight: 500, '& .MuiAlert-icon': { color: '#ff8a80' } }}>{error}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '35px',
          borderRadius: '18px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.06)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 10px rgba(66, 165, 245, 0.4)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#dcdcdc',
          },
          '& .MuiFormHelperText-root': {
            color: '#b0b0b0',
          },
        }}
      >
        <TextField
          label="Title" required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          helperText="Letters, numbers, and basic punctuation only"
        />

        <TextField
          label="Author" required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          helperText="Letters, spaces, dots, hyphens only (e.g. J.K. Rowling)"
        />

        <Autocomplete
          options={GENRES}
          value={formData.genre || null}
          onChange={(e, newValue) => setFormData({ ...formData, genre: newValue || '' })}
          renderInput={(params) => (
            <TextField {...params} label="Genre" required placeholder="Type to search genres..." />
          )}
        />

        <TextField
          label="Price (₹)" type="number" required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          inputProps={{ min: 1, step: 1 }}
          helperText="Must be greater than 0"
        />

        <TextField
          label="ISBN"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          helperText="10 or 13 digits only (optional)"
          inputProps={{ maxLength: 13 }}
        />

        <TextField
          label="Publication Year" type="number"
          value={formData.publicationYear}
          onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
          inputProps={{ min: 1450, max: currentYear, step: 1 }}
          helperText={`Whole number between 1450 and ${currentYear}`}
        />

        <TextField
          label="Cover Image URL" required
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          helperText="Must start with http:// or https://"
        />

        <TextField
          label="Description" multiline rows={4} required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          inputProps={{ maxLength: 1000 }}
          helperText={`${formData.description.length}/1000 characters`}
          error={formData.description.length > 1000}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: '10px',
            py: '12px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            boxShadow: '0 4px 15px rgba(25, 118, 210, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(25, 118, 210, 0.5)',
            },
          }}
        >
          Save Book
        </Button>
      </Box>
    </Container>
  );
};

export default AddBook;