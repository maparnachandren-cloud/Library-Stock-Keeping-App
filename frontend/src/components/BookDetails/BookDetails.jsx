import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, TextField, Box, Alert, CircularProgress
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

const inputStyles = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#e8a04b' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(232,160,75,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#e8a04b', borderWidth: '1.5px' },
  },
  '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' },
  '& .MuiFormHelperText-root.Mui-error': { color: '#ff6b6b' },
};

const glassPanel = {
  background: 'rgba(15,27,45,0.72)',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '18px',
};

const StarDisplay = ({ avg, count }) => {
  const filled = Math.round(Number(avg) || 0);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {[1,2,3,4,5].map((i) =>
        i <= filled
          ? <StarIcon key={i} sx={{ fontSize: 18, color: '#ffc107' }} />
          : <StarBorderIcon key={i} sx={{ fontSize: 18, color: 'rgba(255,193,7,0.35)' }} />
      )}
      {avg && (
        <Typography sx={{ ml: 0.75, fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {avg} · {count} {count === 1 ? 'rating' : 'ratings'}
        </Typography>
      )}
      {!avg && (
        <Typography sx={{ ml: 0.75, fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          No ratings yet
        </Typography>
      )}
    </Box>
  );
};

const BookDetails = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [userRequest, setUserRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchBook = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}`);
      if (!res.ok) { setFetchError('Book not found.'); setLoading(false); return; }
      const data = await res.json();
      setBook(data);
      setLoading(false);
    } catch {
      setFetchError('Failed to load book. Make sure backend is running.');
      setLoading(false);
    }
  };

  const fetchUserRequest = async () => {
    if (currentUser.role === 'admin') return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser._id}/requests`);
      const requests = await res.json();
      const found = requests.find((r) => r.bookId?._id === id || r.bookId === id);
      setUserRequest(found || null);
    } catch { /* leave userRequest as null */ }
  };

  useEffect(() => { fetchBook(); fetchUserRequest(); }, [id]);

  useEffect(() => {
    if (book && currentUser) {
      const existing = book.ratings.find((r) => r.userId === currentUser._id);
      if (existing) setRating(existing.value);
    }
  }, [book]);

  const refreshAll = async () => { await fetchBook(); await fetchUserRequest(); };

  const averageRating = () => {
    if (!book || !book.ratings || book.ratings.length === 0) return null;
    return (book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length).toFixed(1);
  };

  const hasLiked = () => {
    if (!book || !currentUser) return false;
    return book.likedBy?.includes(currentUser._id);
  };

  const getRentButtonProps = () => {
    if (!book) return { label: 'Loading...', disabled: true };
    if (userRequest) {
      if (userRequest.status === 'Pending') return { label: 'Request Pending', disabled: true };
      if (userRequest.status === 'Approved') return { label: 'Currently Rented by You', disabled: true };
      if (userRequest.status === 'Rejected') return { label: 'Re-request', disabled: false };
      if (userRequest.status === 'Returned') return { label: 'Rent Again', disabled: !book.isAvailable };
    }
    if (!book.isAvailable) return { label: 'Book Unavailable', disabled: true };
    return { label: 'Rent Book', disabled: false };
  };

  const handleRent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, bookId: id })
      });
      const data = await res.json();
      if (res.ok) { alert('Rent request submitted! Please wait for admin approval.'); await refreshAll(); }
      else alert(data.message || 'Failed to submit request');
    } catch { alert('Connection error'); }
  };

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:5000/api/books/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      await fetchBook();
    } catch { alert('Connection error'); }
  };

  const handleRate = async () => {
    setRatingError('');
    const numRating = Number(rating);
    if (!rating) { setRatingError('Please enter a rating'); return; }
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      setRatingError('Rating must be a whole number between 1 and 5'); return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, value: numRating })
      });
      if (res.ok) {
        setMessage('Rating submitted!');
        await fetchBook();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setRatingError(data.message || 'Failed to submit rating');
      }
    } catch { alert('Connection error'); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (comment.trim().length > 500) { alert('Comment cannot exceed 500 characters'); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser.name, text: comment })
      });
      if (res.ok) { setComment(''); await fetchBook(); }
      else { const data = await res.json(); alert(data.message || 'Failed to post comment'); }
    } catch { alert('Connection error'); }
  };

  // ── Loading ──
  if (loading) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress sx={{ color: '#e8a04b' }} thickness={3} size={44} />
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.85rem' }}>
            Loading book…
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Error ──
  if (fetchError) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error" sx={{ borderRadius: '10px', bgcolor: '#0f2236', color: '#c8d8e8', border: '1px solid rgba(255,255,255,0.15)', mb: 3, fontWeight: 500, '& .MuiAlert-icon': { color: '#c8d8e8' } }}>
          {fetchError}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
          sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", '&:hover': { color: '#e8a04b' } }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const avg = averageRating();
  const rentBtn = getRentButtonProps();
  const liked = hasLiked();

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 5 }}>

        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate('/home')}
          sx={{
            mb: 4, color: 'rgba(255,255,255,0.45)', textTransform: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem',
            px: 0, '&:hover': { color: '#e8a04b', bgcolor: 'transparent' },
          }}
        >
          Back to catalog
        </Button>

        {/* ── Hero section: cover + info ── */}
        <Box sx={{
          ...glassPanel,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 5 },
          p: { xs: 3, md: 4 },
          mb: 3,
        }}>

          {/* Cover */}
          <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
            <Box sx={{
              width: { xs: 180, md: 220 },
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
            }}>
              <img
                src={book.coverImage}
                alt={book.title}
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/250x350?text=No+Cover'; }}
              />
            </Box>

            {/* Availability badge under cover */}
            <Box sx={{
              px: 2, py: 0.6,
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: 0.5,
              textAlign: 'center',
              width: { xs: 180, md: 220 },
              ...(book.isAvailable ? {
                bgcolor: 'rgba(46,213,115,0.15)',
                color: '#2ed573',
                border: '1px solid rgba(46,213,115,0.3)',
                boxShadow: '0 0 16px rgba(46,213,115,0.15)',
              } : {
                bgcolor: 'rgba(255,71,87,0.15)',
                color: '#ff4757',
                border: '1px solid rgba(255,71,87,0.3)',
                boxShadow: '0 0 16px rgba(255,71,87,0.1)',
              }),
            }}>
              {book.isAvailable ? '● Available' : '● Currently Rented'}
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            {/* Title */}
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: { xs: '1.6rem', md: '2rem' },
              color: '#f0e6d3',
              lineHeight: 1.2,
              letterSpacing: '-0.5px',
            }}>
              {book.title}
            </Typography>

            {/* Author */}
            <Typography sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.55)',
              mt: -0.5,
            }}>
              by {book.author}
            </Typography>

            {/* Genre pill */}
            <Box sx={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
              <Box sx={{
                px: 1.5, py: 0.4,
                bgcolor: 'rgba(232,160,75,0.12)',
                border: '1px solid rgba(232,160,75,0.25)',
                borderRadius: '20px',
                color: '#e8a04b',
                fontSize: '0.75rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                letterSpacing: 0.4,
              }}>
                {book.genre}
              </Box>
            </Box>

            {/* Divider */}
            <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.07)', my: 0.5 }} />

            {/* Meta row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {book.publicationYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {book.publicationYear}
                  </Typography>
                </Box>
              )}
              {book.isbn && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <FingerprintIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    ISBN: {book.isbn}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <MenuBookIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Rental
                </Typography>
              </Box>
            </Box>

            {/* Price */}
            <Typography sx={{
              fontFamily: "'Plus Jakarta Sans', serif",
              fontWeight: 700,
              fontSize: '1.6rem',
              color: '#e8a04b',
              letterSpacing: '-0.5px',
              mt: 0.5,
            }}>
              ₹{book.price}
            </Typography>

            {/* Stars */}
            <StarDisplay avg={avg} count={book.ratings.length} />

            {/* Likes count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FavoriteIcon sx={{ fontSize: 14, color: '#ff6b9d' }} />
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {book.likes} {book.likes === 1 ? 'like' : 'likes'}
              </Typography>
            </Box>

            {/* Description */}
            {book.description && (
              <Typography sx={{
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: 1.7,
                mt: 0.5,
                borderLeft: '2px solid rgba(232,160,75,0.3)',
                pl: 1.5,
              }}>
                {book.description}
              </Typography>
            )}

            {/* Rent + Like buttons */}
            {currentUser.role !== 'admin' && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  disabled={rentBtn.disabled}
                  onClick={handleRent}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 3, py: 1.1,
                    background: rentBtn.disabled
                      ? 'rgba(255,255,255,0.07)'
                      : 'linear-gradient(135deg, #e8a04b 0%, #d4913e 100%)',
                    color: rentBtn.disabled ? 'rgba(255,255,255,0.3)' : '#0a1628',
                    border: 'none',
                    boxShadow: rentBtn.disabled ? 'none' : '0 6px 20px rgba(232,160,75,0.35)',
                    '&:hover:not(:disabled)': {
                      background: 'linear-gradient(135deg, #f0b05e 0%, #e8a04b 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 24px rgba(232,160,75,0.45)',
                    },
                    '&.Mui-disabled': { color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)' },
                    transition: 'all 0.22s ease',
                  }}
                >
                  {rentBtn.label}
                </Button>

                <Button
                  onClick={handleLike}
                  startIcon={liked ? <FavoriteIcon sx={{ fontSize: '18px !important' }} /> : <FavoriteBorderIcon sx={{ fontSize: '18px !important' }} />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 2.5, py: 1.1,
                    transition: 'all 0.22s ease',
                    ...(liked ? {
                      bgcolor: 'rgba(255,107,157,0.18)',
                      color: '#ff6b9d',
                      border: '1px solid rgba(255,107,157,0.35)',
                      '&:hover': { bgcolor: 'rgba(255,107,157,0.25)', transform: 'translateY(-1px)' },
                    } : {
                      bgcolor: 'transparent',
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      '&:hover': { borderColor: '#ff6b9d', color: '#ff6b9d', bgcolor: 'rgba(255,107,157,0.08)', transform: 'translateY(-1px)' },
                    }),
                  }}
                >
                  {liked ? 'Liked' : 'Like'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Rate section ── */}
        {currentUser.role !== 'admin' && (
          <Box sx={{ ...glassPanel, p: { xs: 3, md: 4 }, mb: 3 }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#f0e6d3',
              mb: 2,
            }}>
              Rate this book
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <TextField
                type="number"
                label="Your Rating (1–5)"
                inputProps={{ min: 1, max: 5, step: 1 }}
                value={rating}
                onChange={(e) => { setRatingError(''); setRating(e.target.value); }}
                error={!!ratingError}
                helperText={ratingError || 'Whole numbers only'}
                size="small"
                sx={{ width: 180, ...inputStyles }}
              />
              <Button
                variant="contained"
                onClick={handleRate}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.83rem',
                  px: 2.5, py: 1,
                  background: 'linear-gradient(135deg, #1a3c5e 0%, #0f2540 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e0ecf8',
                  boxShadow: 'none',
                  mt: 0.25,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e8a04b 0%, #d4913e 100%)',
                    color: '#0a1628',
                    boxShadow: '0 6px 20px rgba(232,160,75,0.35)',
                  },
                  transition: 'all 0.22s ease',
                }}
              >
                Submit Rating
              </Button>
            </Box>

            {message && (
              <Alert
                severity="success"
                sx={{
                  mt: 2, width: 'fit-content', borderRadius: '10px',
                  bgcolor: '#0f2236', color: '#c8d8e8',
                  border: '1px solid rgba(255,255,255,0.15)', fontWeight: 500,
                  '& .MuiAlert-icon': { color: '#c8d8e8' },
                }}
              >
                {message}
              </Alert>
            )}
          </Box>
        )}

        {/* ── Comments section ── */}
        <Box sx={{ ...glassPanel, p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 3 }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: '#e8a04b' }} />
            <Typography sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#f0e6d3',
            }}>
              Comments
            </Typography>
            <Box sx={{
              ml: 0.5, px: 1.2, py: 0.2,
              bgcolor: 'rgba(232,160,75,0.12)',
              border: '1px solid rgba(232,160,75,0.2)',
              borderRadius: '20px',
              color: '#e8a04b',
              fontSize: '0.72rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}>
              {book.comments.length}
            </Box>
          </Box>

          {/* Comment input */}
          {currentUser.role !== 'admin' && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth multiline rows={3}
                placeholder="Share your thoughts… (max 500 characters)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                helperText={`${comment.length}/500`}
                error={comment.length > 500}
                sx={{
                  ...inputStyles,
                  '& .MuiOutlinedInput-root': {
                    ...inputStyles['& .MuiOutlinedInput-root'],
                    borderRadius: '14px',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleComment}
                disabled={!comment.trim() || comment.length > 500}
                sx={{
                  mt: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.83rem',
                  px: 2.5, py: 1,
                  background: 'linear-gradient(135deg, #1a3c5e 0%, #0f2540 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e0ecf8',
                  boxShadow: 'none',
                  '&:hover:not(:disabled)': {
                    background: 'linear-gradient(135deg, #e8a04b 0%, #d4913e 100%)',
                    color: '#0a1628',
                    boxShadow: '0 6px 20px rgba(232,160,75,0.35)',
                  },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' },
                  transition: 'all 0.22s ease',
                }}
              >
                Post Comment
              </Button>
            </Box>
          )}

          {/* Divider */}
          <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.07)', mb: 2.5 }} />

          {/* Comment list */}
          {book.comments.length === 0 ? (
            <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 38, color: 'rgba(255,255,255,0.1)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.88rem' }}>
                No comments yet. Be the first!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {book.comments.map((c, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: 'rgba(232,160,75,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                    {/* Avatar initial */}
                    <Box sx={{
                      width: 30, height: 30, borderRadius: '50%',
                      bgcolor: 'rgba(232,160,75,0.18)',
                      border: '1px solid rgba(232,160,75,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#e8a04b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {c.user?.charAt(0)?.toUpperCase() || '?'}
                      </Typography>
                    </Box>
                    <Typography sx={{
                      fontWeight: 600,
                      fontSize: '0.83rem',
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {c.user}
                    </Typography>
                  </Box>
                  <Typography sx={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.65,
                    pl: 0.5,
                  }}>
                    {c.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

      </Container>
    </Box>
  );
};

export default BookDetails;