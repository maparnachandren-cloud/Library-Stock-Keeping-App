import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions } from '@mui/material';

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
      <Typography variant="h3" gutterBottom>
        University Library System
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Welcome to the university's digital library portal. This platform allows students to browse the catalog, request physical copies of books, and manage their borrowing history. Take a glimpse at our catalog below, and log in to request your next read.
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4, textAlign: 'left' }}>
        {featuredBooks.length === 0 ? (
          <Typography sx={{ width: '100%', mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            Loading preview...
          </Typography>
        ) : (
          featuredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={3} key={book._id}>
              <Card 
                variant="outlined" 
                onClick={handleCardClick}
                sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>{book.author}</Typography>
                  <Typography variant="body2">Category: {book.category}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" fullWidth>Login to View</Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Button variant="contained" size="large" component={Link} to="/login">
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default Welcome;