import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardActions, Button, Box, TextField,
  MenuItem, InputAdornment, IconButton, Collapse, Paper,
  Autocomplete, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link } from 'react-router-dom';

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
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Failed to load books. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
      setPriceError('Min price cannot be greater than max price');
    } else {
      setPriceError('');
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (priceError) return;

    let updated = [...books];

    if (search) {
      updated = updated.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (genreFilter) {
      updated = updated.filter(
        (book) => book.genre?.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (ratingFilter) {
      updated = updated.filter((book) => {
        if (!book.ratings || book.ratings.length === 0) return false;
        const avg = book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length;
        return avg >= Number(ratingFilter);
      });
    }

    if (minPrice !== '') {
      updated = updated.filter((book) => Number(book.price) >= Number(minPrice));
    }
    if (maxPrice !== '') {
      updated = updated.filter((book) => Number(book.price) <= Number(maxPrice));
    }

    if (sortBy) {
      updated.sort((a, b) => {
        let valueA, valueB;

        if (sortBy === 'price') {
          valueA = a.price || 0;
          valueB = b.price || 0;
        } else if (sortBy === 'rating') {
          valueA = a.ratings?.length
            ? a.ratings.reduce((s, r) => s + r.value, 0) / a.ratings.length : 0;
          valueB = b.ratings?.length
            ? b.ratings.reduce((s, r) => s + r.value, 0) / b.ratings.length : 0;
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
  }, [books, search, sortBy, sortOrder, genreFilter, ratingFilter, minPrice, maxPrice, priceError]);

  const clearFilters = () => {
    setGenreFilter('');
    setRatingFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSortOrder('asc');
    setSearch('');
    setPriceError('');
  };

  if (loading) {
    return <Container sx={{ mt: 4 }}><Typography>Loading books...</Typography></Container>;
  }

  if (fetchError) {
    return <Container sx={{ mt: 4 }}><Alert severity="error">{fetchError}</Alert></Container>;
  }
  const inputWhiteStyles = {
    '& .MuiInputLabel-root': { color: '#ffffff' },
    '& .MuiOutlinedInput-root': {
      color: '#ffffff',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: '#ffffff' },
      '&.Mui-focused fieldset': { borderColor: '#ffffff' },
    },
    '& .MuiSvgIcon-root': { color: '#ffffff' },
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Library Catalog
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          size="small"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        <Box sx={{ width: 350 }}>
          <TextField
            fullWidth size="small" label="Search books"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, bgcolor: '#1e1e1e' }}>
          <Autocomplete
            options={GENRES}
            value={genreFilter || null}
            onChange={(e, newValue) => setGenreFilter(newValue || '')}
            sx={{ minWidth: 200, ...inputWhiteStyles }}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Genre" placeholder="Type to filter..." />
            )}
          />

          <TextField
            select size="small" label="Min Rating"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            sx={{ minWidth: 150, ...inputWhiteStyles }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#2e2e2e', color: '#fff' } } } }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1★+</MenuItem>
            <MenuItem value="2">2★+</MenuItem>
            <MenuItem value="3">3★+</MenuItem>
            <MenuItem value="4">4★+</MenuItem>
            <MenuItem value="5">5★ only</MenuItem>
          </TextField>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small" label="Min Price " type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value < 0 ? '' : e.target.value)}
                inputProps={{ min: 0, step: 1 }}
                sx={{ width: 130, ...inputWhiteStyles }}
                error={!!priceError}
              />
              <TextField
                size="small" label="Max Price " type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value < 0 ? '' : e.target.value)}
                inputProps={{ min: 0, step: 1 }}
                sx={{ width: 130, ...inputWhiteStyles }}
                error={!!priceError}
              />
            </Box>
            {priceError && (
              <Typography color="error" variant="caption">{priceError}</Typography>
            )}
          </Box>

          <TextField
            select size="small" label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 150, ...inputWhiteStyles }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#2e2e2e', color: '#fff' } } } }}
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
            sx={{ minWidth: 120, ...inputWhiteStyles }}
            SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#2e2e2e', color: '#fff' } } } }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>

          <Button 
            size="small" 
            variant="outlined" 
            onClick={clearFilters}
            sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#ffffff' } }}
          >
            Clear Filters
          </Button>
        </Paper>
      </Collapse>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredBooks.length} of {books.length} books
      </Typography>

      {filteredBooks.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No books found matching your filters.
        </Typography>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {filteredBooks.map((book) => {
            const avg = book.ratings?.length
              ? (book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length).toFixed(1)
              : null;

            return (
              <Grid item xs={12} sm={6} md={3} key={book._id} sx={{ display: 'flex' }}>
                <Card 
                  sx={{ 
                    width: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: "100%", 
                      height: "280px", 
                      overflow: "hidden", 
                      bgcolor: "#f7f7f7", 
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/300x400'} 
                      alt={book.title}
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover"
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        component="h2"
                        sx={{ 
                          fontWeight: 'bold',
                          minHeight: '48px', 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1,
                          color: '#1a1a1a'
                        }}
                      >
                        {book.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#424242' }}>Author: {book.author}</Typography>
                      <Typography variant="body2" sx={{ color: '#424242' }}>Genre: {book.genre}</Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" fontWeight="bold" sx={{ my: 0.5, color: '#1a1a1a' }}>₹ {book.price}</Typography>
                      <Typography variant="body2" sx={{ color: '#555555' }}>
                        {avg ? `⭐ ${avg}` : 'No ratings'} &nbsp; ❤️ {book.likes || 0}
                      </Typography>
                      <Typography
                        fontWeight="bold" fontSize="0.85rem" sx={{ mt: 0.5, color: book.isAvailable ? '#2e7d32' : '#d32f2f' }}
                      >
                        {book.isAvailable ? 'Available' : 'Rented'}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button component={Link} to={`/book/${book._id}`} variant="contained" fullWidth>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Home;