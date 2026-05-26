import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const AddBook = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    title: '',
    author: '',
    genre: '',
    description: '',
    price: '',
    coverImage: ''

  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await fetch(
      'http://localhost:5000/api/books',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)
      }
    );

    if (res.ok) {

      alert('Book added successfully');

      navigate('/admin/dashboard');

    } else {

      alert('Failed to add book');

    }
  };

  return (

    <Container
      maxWidth="sm"
      sx={{ mt: 4 }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Add Book
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >

        <TextField
          label="Title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value
            })
          }
        />

        <TextField
          label="Author"
          required
          value={formData.author}
          onChange={(e) =>
            setFormData({
              ...formData,
              author: e.target.value
            })
          }
        />

        <FormControl fullWidth required>

          <InputLabel>
            Genre
          </InputLabel>

          <Select
            value={formData.genre}
            label="Genre"
            onChange={(e) =>
              setFormData({
                ...formData,
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
          required
          value={formData.price}
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value
            })
          }
        />

        <TextField
          label="Cover Image URL"
          required
          value={formData.coverImage}
          onChange={(e) =>
            setFormData({
              ...formData,
              coverImage: e.target.value
            })
          }
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value
            })
          }
        />

        <Button
          type="submit"
          variant="contained"
        >
          Save Book
        </Button>

      </Box>

    </Container>

  );
};

export default AddBook;