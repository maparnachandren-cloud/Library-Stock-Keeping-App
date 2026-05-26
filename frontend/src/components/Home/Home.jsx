import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Collapse,
  Paper
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Link } from 'react-router-dom';

function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [search, setSearch] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [genreFilter, setGenreFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
      });
  }, []);

  useEffect(() => {
    let updated = [...books];

    if (search) {
      updated = updated.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genreFilter) {
      updated = updated.filter(
        (book) =>
          book.genre?.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (ratingFilter) {
      updated = updated.filter(
        (book) => (book.averageRating || 0) >= Number(ratingFilter)
      );
    }

    if (minPrice !== '') {
      updated = updated.filter(
        (book) => Number(book.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== '') {
      updated = updated.filter(
        (book) => Number(book.price) <= Number(maxPrice)
      );
    }

    if (sortBy) {
      updated.sort((a, b) => {
        let valueA, valueB;

        if (sortBy === 'price') {
          valueA = a.price || 0;
          valueB = b.price || 0;
        } else if (sortBy === 'rating') {
          valueA = a.averageRating || 0;
          valueB = b.averageRating || 0;
        } else if (sortBy === 'likes') {
          valueA = a.likes || 0;
          valueB = b.likes || 0;
        } else if (sortBy === 'comments') {
          valueA = a.comments?.length || 0;
          valueB = b.comments?.length || 0;
        } else if (sortBy === 'alphabetical') {
          valueA = a.title?.toLowerCase() || '';
          valueB = b.title?.toLowerCase() || '';
        } else if (sortBy === 'date') {
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
        }

        if (sortOrder === 'asc') return valueA > valueB ? 1 : -1;
        return valueA < valueB ? 1 : -1;
      });
    }

    setFilteredBooks(updated);
  }, [
    books,
    search,
    sortBy,
    sortOrder,
    genreFilter,
    ratingFilter,
    minPrice,
    maxPrice
  ]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Library Catalog
      </Typography>

      {/* TOP BAR */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          size="small"
        >
          Filters
        </Button>

        <Box sx={{ width: 350 }}>
          <TextField
            fullWidth
            size="small"
            label="Search books"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>

      {/* FILTER PANEL */}
      <Collapse in={showFilters}>
        <Paper
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {/* GENRE */}
          <TextField
            select
            size="small"
            label="Genre"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Mystery">Mystery</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
            <MenuItem value="Science Fiction">Science Fiction</MenuItem>
            <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
            <MenuItem value="Biography">Biography</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Self-Help">Self-Help</MenuItem>
            <MenuItem value="Technology">Technology</MenuItem>
            <MenuItem value="Programming">Programming</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Philosophy">Philosophy</MenuItem>
            <MenuItem value="Psychology">Psychology</MenuItem>
            <MenuItem value="Horror">Horror</MenuItem>
            <MenuItem value="Thriller">Thriller</MenuItem>
            <MenuItem value="Poetry">Poetry</MenuItem>
            <MenuItem value="Comics">Comics</MenuItem>
          </TextField>

          {/* RATING */}
          <TextField
            select
            size="small"
            label="Rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1★+</MenuItem>
            <MenuItem value="2">2★+</MenuItem>
            <MenuItem value="3">3★+</MenuItem>
            <MenuItem value="4">4★+</MenuItem>
            <MenuItem value="5">5★</MenuItem>
          </TextField>

          {/* PRICE */}
          <TextField
            size="small"
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <TextField
            size="small"
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          {/* SORT BY */}
          <TextField
            select
            size="small"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="likes">Likes</MenuItem>
            <MenuItem value="comments">Comments</MenuItem>
            <MenuItem value="alphabetical">A-Z</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </TextField>

          {/* ORDER */}
          <TextField
            select
            size="small"
            label="Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </TextField>
        </Paper>
      </Collapse>

      {/* BOOK GRID */}
      <Grid container spacing={3}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="280"
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
                <Typography color="text.secondary">
                  ₹{book.price}
                </Typography>
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={`/book/${book._id}`}
                  variant="contained"
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;