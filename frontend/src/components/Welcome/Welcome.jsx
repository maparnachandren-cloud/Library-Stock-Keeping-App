import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@mui/material';

function Welcome() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => setFeaturedBooks(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  const handleCardClick = () => {
    navigate('/login');
  };

  return (
    <Container sx={{ mt: 5, textAlign: 'center' }}>

      {/* HEADING */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Nalanda Bookstore
      </Typography>

      {/* PARAGRAPH (FEATURE FOCUSED) */}
      <Typography variant="body1" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
        Nalanda Bookstore is a modern digital library platform designed to simplify book discovery and management.
        Users can explore a wide collection of books across different genres, view detailed information including
        ratings, reviews, and pricing, and track their reading preferences. The system also supports advanced search,
        filtering, and sorting features to help users quickly find what they need. With a clean and intuitive interface,
        Nalanda Bookstore makes reading more accessible and organized for everyone.
      </Typography>

      {/* FEATURED BOOKS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {featuredBooks.length === 0 ? (
          <Typography sx={{ width: '100%', mt: 2, color: 'text.secondary' }}>
            Loading preview...
          </Typography>
        ) : (
          featuredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book._id}>

              <Card
                onClick={handleCardClick}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.03)' }
                }}
              >

                <CardMedia
                  component="img"
                  height="200"
                  image={book.coverImage || 'https://via.placeholder.com/300x400'}
                  alt={book.title}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="text.secondary">
                    Author: {book.author}
                  </Typography>
                  <Typography color="text.secondary">
                    Genre: {book.genre}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button fullWidth variant="contained">
                    Login to View
                  </Button>
                </CardActions>

              </Card>

            </Grid>
          ))
        )}
      </Grid>

      {/* GET STARTED */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Box>

    </Container>
  );
}

export default Welcome;