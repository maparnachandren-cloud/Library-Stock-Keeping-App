import { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent,
  CardActions, Button, Box, TextField,
  MenuItem, InputAdornment, IconButton, Collapse, Paper,
  Autocomplete, Alert, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
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
 
// Shared dark dropdown menu styles
const darkMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: '#0f1b2d',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      color: '#fff',
      '& .MuiMenuItem-root': {
        fontSize: '0.85rem',
        '&:hover': { bgcolor: 'rgba(232,160,75,0.15)' },
        '&.Mui-selected': { bgcolor: 'rgba(232,160,75,0.2)', color: '#e8a04b' },
      },
    },
  },
};
 
// Shared white input field styles
const inputStyles = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e8a04b' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(232,160,75,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#e8a04b', borderWidth: '1.5px' },
  },
  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
  '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none' },
};
 
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
 
  const activeFilterCount = [genreFilter, ratingFilter, minPrice, maxPrice, sortBy].filter(Boolean).length;
 
  if (loading) {
    return (
      <Box sx={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2
      }}>
        <AutoStoriesIcon sx={{ fontSize: 48, color: '#e8a04b', opacity: 0.7,
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 1 } }
        }} />
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 1 }}>
          Loading catalog…
        </Typography>
      </Box>
    );
  }
 
  if (fetchError) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error" sx={{ borderRadius: '10px', bgcolor: '#0f2236', color: '#c8d8e8', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 500, '& .MuiAlert-icon': { color: '#c8d8e8' } }}>
          {fetchError}
        </Alert>
      </Container>
    );
  }
 
  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 5 }}>
 
        {/* ── Page Header ── */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <AutoStoriesIcon sx={{ color: '#e8a04b', fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.5px',
                textShadow: '0 2px 20px rgba(232,160,75,0.3)',
              }}
            >
              Library Catalog
            </Typography>
          </Box>
          <Typography sx={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.88rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            ml: 0.5,
          }}>
            Discover your next great read
          </Typography>
        </Box>
 
        {/* ── Search + Filter Toggle Row ── */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}>
          {/* Search bar */}
          <Box sx={{ flex: 1, minWidth: 220, maxWidth: 520 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                ...inputStyles,
                '& .MuiOutlinedInput-root': {
                  ...inputStyles['& .MuiOutlinedInput-root'],
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.07)',
                  paddingLeft: '6px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>
 
          {/* Filter toggle button */}
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<TuneIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="small"
            sx={{
              borderRadius: '50px',
              px: 2.5,
              py: 0.85,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'none',
              letterSpacing: 0.3,
              ...(showFilters ? {
                bgcolor: '#e8a04b',
                color: '#0a1628',
                border: 'none',
                '&:hover': { bgcolor: '#d4913e' },
                boxShadow: '0 4px 16px rgba(232,160,75,0.4)',
              } : {
                color: 'rgba(255,255,255,0.75)',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': { borderColor: '#e8a04b', color: '#e8a04b', bgcolor: 'rgba(232,160,75,0.08)' },
              }),
            }}
          >
            Filters
            {activeFilterCount > 0 && (
              <Box component="span" sx={{
                ml: 1, bgcolor: showFilters ? 'rgba(0,0,0,0.25)' : '#e8a04b',
                color: showFilters ? '#fff' : '#0a1628',
                borderRadius: '50%', width: 18, height: 18,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
              }}>
                {activeFilterCount}
              </Box>
            )}
          </Button>
        </Box>
 
        {/* ── Filters Panel ── */}
        <Collapse in={showFilters}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-start',
              background: 'rgba(15,27,45,0.75)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Genre */}
            <Autocomplete
              options={GENRES}
              value={genreFilter || null}
              onChange={(e, newValue) => setGenreFilter(newValue || '')}
              sx={{ minWidth: 200, ...inputStyles }}
              componentsProps={{ paper: { sx: { bgcolor: '#0f1b2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', '& .MuiAutocomplete-option': { fontSize: '0.83rem', '&:hover': { bgcolor: 'rgba(232,160,75,0.15)' }, '&[aria-selected="true"]': { bgcolor: 'rgba(232,160,75,0.2)' } } } } }}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Genre" placeholder="Type to filter…" />
              )}
            />
 
            {/* Min Rating */}
            <TextField
              select size="small" label="Min Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              sx={{ minWidth: 140, ...inputStyles }}
              SelectProps={{ MenuProps: darkMenuProps }}
            >
              <MenuItem value="">All ratings</MenuItem>
              <MenuItem value="1">1★ +</MenuItem>
              <MenuItem value="2">2★ +</MenuItem>
              <MenuItem value="3">3★ +</MenuItem>
              <MenuItem value="4">4★ +</MenuItem>
              <MenuItem value="5">5★ only</MenuItem>
            </TextField>
 
            {/* Price range */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField
                  size="small" label="Min ₹" type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value < 0 ? '' : e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                  sx={{ width: 110, ...inputStyles }}
                  error={!!priceError}
                />
                <TextField
                  size="small" label="Max ₹" type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value < 0 ? '' : e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                  sx={{ width: 110, ...inputStyles }}
                  error={!!priceError}
                />
              </Box>
              {priceError && (
                <Typography sx={{ color: '#ff6b6b', fontSize: '0.72rem', ml: 0.5 }}>{priceError}</Typography>
              )}
            </Box>
 
            {/* Sort by */}
            <TextField
              select size="small" label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 145, ...inputStyles }}
              SelectProps={{ MenuProps: darkMenuProps }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="likes">Likes</MenuItem>
              <MenuItem value="comments">Comments</MenuItem>
              <MenuItem value="alphabetical">A – Z</MenuItem>
              <MenuItem value="date">Date Added</MenuItem>
            </TextField>
 
            {/* Order */}
            <TextField
              select size="small" label="Order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{ minWidth: 130, ...inputStyles }}
              SelectProps={{ MenuProps: darkMenuProps }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
 
            {/* Clear */}
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon fontSize="small" />}
                sx={{
                  color: 'rgba(255,255,255,0.55)',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  borderRadius: '8px',
                  px: 1.5,
                  alignSelf: 'center',
                  '&:hover': { color: '#ff8a80', bgcolor: 'rgba(255,100,100,0.08)' },
                }}
              >
                Clear all
              </Button>
            )}
          </Paper>
        </Collapse>
 
        {/* ── Results count ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.82rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Showing
          </Typography>
          <Chip
            label={`${filteredBooks.length} / ${books.length}`}
            size="small"
            sx={{
              bgcolor: 'rgba(232,160,75,0.12)',
              color: '#e8a04b',
              border: '1px solid rgba(232,160,75,0.25)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 22,
            }}
          />
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            books
          </Typography>
        </Box>
 
        {/* ── Empty state ── */}
        {filteredBooks.length === 0 ? (
          <Box sx={{
            minHeight: '35vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
          }}>
            <AutoStoriesIcon sx={{ fontSize: 52, color: 'rgba(255,255,255,0.15)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
              No books match your filters
            </Typography>
            <Button
              size="small" onClick={clearFilters}
              sx={{
                color: '#e8a04b', textTransform: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'rgba(232,160,75,0.1)' },
              }}
            >
              Clear filters
            </Button>
          </Box>
        ) : (
 
          /* ── Book Grid ── */
          <Grid container spacing={2.5} alignItems="stretch">
            {filteredBooks.map((book) => {
              const avg = book.ratings?.length
                ? (book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length).toFixed(1)
                : null;
 
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id} sx={{ display: 'flex' }}>
                  <Card
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(15,27,45,0.72)',
                      backdropFilter: 'blur(18px)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                      transition: 'transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease, border-color 0.28s ease',
                      '&:hover': {
                        transform: 'translateY(-10px) scale(1.012)',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.55)',
                        borderColor: 'rgba(232,160,75,0.35)',
                      },
                      '&:hover .book-cover-overlay': { opacity: 1 },
                    }}
                  >
                    {/* Cover image */}
                    <Box sx={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', flexShrink: 0 }}>
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/300x400?text=No+Cover'}
                        alt={book.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* Subtle gradient overlay at bottom */}
                      <Box sx={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '60px',
                        background: 'linear-gradient(to top, rgba(10,22,40,0.85) 0%, transparent 100%)',
                      }} />
                      {/* Hover shine overlay */}
                      <Box
                        className="book-cover-overlay"
                        sx={{
                          position: 'absolute', inset: 0, opacity: 0,
                          background: 'linear-gradient(135deg, rgba(232,160,75,0.12) 0%, transparent 60%)',
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* Availability badge pinned on cover */}
                      <Box sx={{
                        position: 'absolute', top: 10, right: 10,
                        px: 1.2, py: 0.4,
                        borderRadius: '20px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        letterSpacing: 0.4,
                        backdropFilter: 'blur(10px)',
                        ...(book.isAvailable ? {
                          bgcolor: 'rgba(46,213,115,0.18)',
                          color: '#009688',
                          border: '1px solid rgba(51, 170, 100, 0.62)',
                          boxShadow: '0 0 10px rgba(46,213,115,0.2)',
                        } : {
                          bgcolor: 'rgba(6, 0, 1, 0.61)',
                          color: '#bfe1c181',
                          border: '1px solid rgba(255,71,87,0.35)',
                          boxShadow: '0 0 10px rgba(24, 8, 10, 0.15)',
                        }),
                      }}>
                        {book.isAvailable ? '● Available' : '● Rented'}
                      </Box>
                    </Box>
 
                    {/* Card content */}
                    <CardContent sx={{
                      flexGrow: 1, display: 'flex', flexDirection: 'column',
                      gap: 0.5, p: 2, pb: '12px !important',
                    }}>
                      {/* Title */}
                      <Typography
                        variant="subtitle1"
                        component="h2"
                        sx={{
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: '0.97rem',
                          color: '#f0e6d3',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '44px',
                          mb: 0.5,
                        }}
                      >
                        {book.title}
                      </Typography>
 
                      {/* Author & Genre */}
                      <Typography sx={{
                        fontSize: '0.98rem',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        {book.author}
                      </Typography>
                      <Box sx={{
                        display: 'inline-flex', alignSelf: 'flex-start',
                        px: 1, py: 0.2,
                        bgcolor: 'rgba(255,255,255,0.06)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        mt: 0.25,
                      }}>
                        <Typography sx={{
                          fontSize: '0.7rem',
                          color: 'rgba(255,255,255,0.4)',
                          fontFamily: "'Play', sans-serif",
                          letterSpacing: 0.3,
                        }}>
                          {book.genre}
                        </Typography>
                      </Box>
 
                      {/* Price + stats row */}
                      <Box sx={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', mt: 'auto', pt: 1.5,
                      }}>
                        <Typography sx={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#e8a04b',
                          letterSpacing: '-0.3px',
                        }}>
                          ₹{book.price}
                        </Typography>
 
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <StarIcon sx={{ fontSize: 13, color: '#ffc107' }} />
                            <Typography sx={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {avg ?? '—'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <FavoriteIcon sx={{ fontSize: 12, color: '#ff6b9d' }} />
                            <Typography sx={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              {book.likes || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
 
                    {/* View Details button */}
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/book/${book._id}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          letterSpacing: 0.3,
                          py: 1,
                          background: 'linear-gradient(135deg, #1a3c5e 0%, #0f2540 100%)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#e0ecf8',
                          boxShadow: 'none',
                          transition: 'all 0.22s ease',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #e8a04b 0%, #d4913e 100%)',
                            color: '#0a1628',
                            border: '1px solid transparent',
                            boxShadow: '0 6px 20px rgba(232,160,75,0.4)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
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
    </Box>
  );
}
 
export default Home;