import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
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

const AddBook = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    coverImage: '',
    isbn: '',
    publicationYear: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: Number(formData.price),
        publicationYear: formData.publicationYear
          ? Number(formData.publicationYear)
          : null
      })
    });

    if (res.ok) {
      alert('Book added successfully');
      navigate('/admin/dashboard');
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to add book');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Book
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextField
          label="Author"
          required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />

        <Autocomplete
          options={GENRES}
          value={formData.genre || null}
          onChange={(e, newValue) =>
            setFormData({ ...formData, genre: newValue || '' })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Genre"
              required
              placeholder="Type to search genres..."
            />
          )}
        />

        <TextField
          label="Price (₹)"
          type="number"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <TextField
          label="ISBN"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
        />

        <TextField
          label="Publication Year"
          type="number"
          value={formData.publicationYear}
          onChange={(e) =>
            setFormData({ ...formData, publicationYear: e.target.value })
          }
        />

        <TextField
          label="Cover Image URL"
          required
          value={formData.coverImage}
          onChange={(e) =>
            setFormData({ ...formData, coverImage: e.target.value })
          }
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <Button type="submit" variant="contained">
          Save Book
        </Button>
      </Box>
    </Container>
  );
};

export default AddBook;