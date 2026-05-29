import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardMedia, CardActions, Button, Box, TextField,
  MenuItem, InputAdornment, IconButton, Collapse, Paper,
  Autocomplete
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

    // Search by title
    if (search) {
      updated = updated.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Genre filter
    if (genreFilter) {
      updated = updated.filter(
        (book) => book.genre?.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    // Rating filter — compute average inline from ratings array
    if (ratingFilter) {
      updated = updated.filter((book) => {
        if (!book.ratings || book.ratings.length === 0) return false;
        const avg =
          book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length;
        return avg >= Number(ratingFilter);
      });
    }

    // Price filters
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

    // Sort
    if (sortBy) {
      updated.sort((a, b) => {
        let valueA, valueB;

        if (sortBy === 'price') {
          valueA = a.price || 0;
          valueB = b.price || 0;
        } else if (sortBy === 'rating') {
          valueA =
            a.ratings?.length
              ? a.ratings.reduce((s, r) => s + r.value, 0) / a.ratings.length
              : 0;
          valueB =
            b.ratings?.length
              ? b.ratings.reduce((s, r) => s + r.value, 0) / b.ratings.length
              : 0;
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
  }, [books, search, sortBy, sortOrder, genreFilter, ratingFilter, minPrice, maxPrice]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Library Catalog
      </Typography>

      {/* Top bar */}
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

      {/* Filter panel */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Autocomplete
            options={[
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
            ]}
            value={genreFilter || null}
            onChange={(e, newValue) => setGenreFilter(newValue || '')}
            sx={{ minWidth: 200 }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Genre" placeholder="Type to filter..." />
            )}
          />

          <TextField
            select size="small" label="Min Rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1★+</MenuItem>
            <MenuItem value="2">2★+</MenuItem>
            <MenuItem value="3">3★+</MenuItem>
            <MenuItem value="4">4★+</MenuItem>
            <MenuItem value="5">5★ only</MenuItem>
          </TextField>

          <TextField
            size="small" label="Min Price (₹)" type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: 130 }}
          />

          <TextField
            size="small" label="Max Price (₹)" type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: 130 }}
          />

          <TextField
            select size="small" label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="likes">Likes</MenuItem>
            <MenuItem value="comments">Comments</MenuItem>
            <MenuItem value="alphabetical">A–Z</MenuItem>
            <MenuItem value="date">Date Added</MenuItem>
          </TextField>

          <TextField
            select size="small" label="Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>

          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setGenreFilter('');
              setRatingFilter('');
              setMinPrice('');
              setMaxPrice('');
              setSortBy('');
              setSortOrder('asc');
              setSearch('');
            }}
          >
            Clear Filters
          </Button>
        </Paper>
      </Collapse>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredBooks.length} of {books.length} books
      </Typography>

      {/* Book grid */}
      <Grid container spacing={3}>
        {filteredBooks.map((book) => {
          const avg =
            book.ratings?.length
              ? (
                  book.ratings.reduce((a, b) => a + b.value, 0) /
                  book.ratings.length
                ).toFixed(1)
              : null;

          return (
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
                  <Typography color="text.secondary">₹ {book.price}</Typography>
                  <Typography color="text.secondary">
                    {avg ? `⭐ ${avg}` : 'No ratings'} &nbsp; ❤️ {book.likes || 0}
                  </Typography>
                  <Typography
                    color={book.isAvailable ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                    fontSize="0.85rem"
                  >
                    {book.isAvailable ? 'Available' : 'Rented'}
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
          );
        })}
      </Grid>

      {filteredBooks.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No books found matching your filters.
        </Typography>
      )}
    </Container>
  );
}

export default Home;