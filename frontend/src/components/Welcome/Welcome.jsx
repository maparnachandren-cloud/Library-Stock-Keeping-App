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
  CardActions,
  Chip
} from '@mui/material';

function Welcome() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => setFeaturedBooks(data.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  const handleCardClick = () => {
    navigate('/login');
  };

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a3c5e 0%, #0f2540 100%)',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 5,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(232,160,75,0.12)',
          },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#e8a04b',
            letterSpacing: 3,
          }}
        >
          DIGITAL LIBRARY
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            mt: 1,
            mb: 2,
            fontSize: { xs: '2rem', md: '2.8rem' },
            position: 'relative',
            zIndex: 1,
          }}
        >
          Discover Your Next
          <br />
          Great Read
        </Typography>

        <Typography
          sx={{
            opacity: 0.85,
            mb: 3,
            maxWidth: 500,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Explore thousands of books across every genre.
          Search, discover, review, and manage your reading
          journey through Nalanda Bookstore's modern digital
          library platform.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
          sx={{
            borderRadius: 10,
            px: 4,
            fontWeight: 600,
            bgcolor: '#e8a04b',
            '&:hover': {
              bgcolor: '#d8923f',
            },
          }}
        >
          Get Started Free
        </Button>
      </Box>

      {/* FEATURED BOOKS */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontWeight: 700,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Featured Books
      </Typography>

      <Grid container spacing={3}>
        {featuredBooks.length === 0 ? (
          <Typography
            sx={{
              width: '100%',
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            Loading books...
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
                  bgcolor:'#d4d4d4',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 40px rgba(26,60,94,0.18)',
                  },
                }}
              >
                <Box sx={{ overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={
                      book.coverImage ||
                      'https://via.placeholder.com/300x400'
                    }
                    alt={book.title}
                    sx={{
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      mb: 0.5,
                      fontWeight: 600,
                      color:'#000000'
                    }}
                  >
                    {book.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'black',
                      fontSize: '0.85rem',
                    }}
                  >
                    {book.author}
                  </Typography>

                  <Chip
                    label={book.genre}
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: '#ff6200',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                    }}
                  />
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: 8,
                      bgcolor:'#006aff'
                    }}
                  >
                    Login to View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default Welcome;