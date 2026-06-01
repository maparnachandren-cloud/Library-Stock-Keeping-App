import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, TextField, Box, Alert, CircularProgress
} from '@mui/material';

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
      if (!res.ok) {
        setFetchError('Book not found.');
        setLoading(false);
        return;
      }
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
      const res = await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/requests`
      );
      const requests = await res.json();
      const found = requests.find(
        (r) => r.bookId?._id === id || r.bookId === id
      );
      setUserRequest(found || null);
    } catch {
      // non-critical, leave userRequest as null
    }
  };

  useEffect(() => {
    fetchBook();
    fetchUserRequest();
  }, [id]);

  // Pre-fill rating with user's existing rating
  useEffect(() => {
    if (book && currentUser) {
      const existing = book.ratings.find((r) => r.userId === currentUser._id);
      if (existing) setRating(existing.value);
    }
  }, [book]);

  const refreshAll = async () => {
    await fetchBook();
    await fetchUserRequest();
  };

  const averageRating = () => {
    if (!book || !book.ratings || book.ratings.length === 0) return null;
    const avg = book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length;
    return avg.toFixed(1);
  };

  const hasLiked = () => {
    if (!book || !currentUser) return false;
    return book.likedBy?.includes(currentUser._id);
  };

  const getRentButtonProps = () => {
    if (!book) return { label: 'Loading...', disabled: true };

    if (userRequest) {
      if (userRequest.status === 'Pending')
        return { label: 'Request Pending', disabled: true };
      if (userRequest.status === 'Approved')
        return { label: 'Currently Rented by You', disabled: true };
      if (userRequest.status === 'Rejected')
        return { label: 'Re-request', disabled: false };
      if (userRequest.status === 'Returned')
        return { label: 'Rent Again', disabled: !book.isAvailable };
    }

    if (!book.isAvailable)
      return { label: 'Book Unavailable', disabled: true };

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
      if (res.ok) {
        alert('Rent request submitted! Please wait for admin approval.');
        await refreshAll();
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch {
      alert('Connection error');
    }
  };

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:5000/api/books/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      await fetchBook();
    } catch {
      alert('Connection error');
    }
  };

  const handleRate = async () => {
    setRatingError('');
    const numRating = Number(rating);

    if (!rating) {
      setRatingError('Please enter a rating');
      return;
    }
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      setRatingError('Rating must be a whole number between 1 and 5');
      return;
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
    } catch {
      alert('Connection error');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (comment.trim().length > 500) {
      alert('Comment cannot exceed 500 characters');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser.name, text: comment })
      });
      if (res.ok) {
        setComment('');
        await fetchBook();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to post comment');
      }
    } catch {
      alert('Connection error');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (fetchError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const avg = averageRating();
  const rentBtn = getRentButtonProps();

  return (
    <Container sx={{ mt: 4 }}>
      <img
        src={book.coverImage}
        alt={book.title}
        width="250"
        style={{ borderRadius: '8px' }}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/250x350'; }}
      />

      <Typography variant="h4" sx={{ mt: 2 }}>{book.title}</Typography>
      <Typography>Author: {book.author}</Typography>
      <Typography>Genre: {book.genre}</Typography>
      {book.isbn && <Typography>ISBN: {book.isbn}</Typography>}
      {book.publicationYear && <Typography>Publication Year: {book.publicationYear}</Typography>}
      <Typography>₹ {book.price}</Typography>
      <Typography sx={{ mt: 1 }}>{book.description}</Typography>
      <Typography sx={{ mt: 1 }}>
        Status: <strong>{book.isAvailable ? 'Available' : 'Rented'}</strong>
      </Typography>

      {/* Rating display */}
      <Typography sx={{ mt: 1 }}>
        {avg
          ? `⭐ ${avg} (${book.ratings.length} rating${book.ratings.length !== 1 ? 's' : ''})`
          : 'No ratings yet'}
      </Typography>

      {/* Likes display */}
      <Typography>
        ❤️ {book.likes} {book.likes === 1 ? 'like' : 'likes'}
      </Typography>

      {/* Rent and Like — admin cannot */}
      {currentUser.role !== 'admin' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" disabled={rentBtn.disabled} onClick={handleRent}>
            {rentBtn.label}
          </Button>

          <Button
            variant={hasLiked() ? 'contained' : 'outlined'}
            color="error"
            onClick={handleLike}
          >
            {hasLiked() ? '❤️ Liked' : '🤍 Like'}
          </Button>
        </Box>
      )}

      {/* Rate — admin cannot */}
      {currentUser.role !== 'admin' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Rate this book</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <TextField
              type="number"
              label="Your Rating (1-5)"
              inputProps={{ min: 1, max: 5, step: 1 }}
              value={rating}
              onChange={(e) => {
                setRatingError('');
                setRating(e.target.value);
              }}
              error={!!ratingError}
              helperText={ratingError || 'Whole numbers only'}
              sx={{ width: 180 }}
            />
            <Button variant="contained" onClick={handleRate}>
              Submit Rating
            </Button>
          </Box>
          {message && (
            <Alert severity="success" sx={{ mt: 1, width: 'fit-content' }}>
              {message}
            </Alert>
          )}
        </Box>
      )}

      {/* Comments */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Comments ({book.comments.length})
        </Typography>

        {/* Add comment — admin cannot */}
        {currentUser.role !== 'admin' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth multiline rows={3}
              placeholder="Write a comment... (max 500 characters)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              helperText={`${comment.length}/500`}
              error={comment.length > 500}
            />
            <Button
              variant="contained"
              onClick={handleComment}
              disabled={!comment.trim() || comment.length > 500}
              sx={{ mt: 1 }}
            >
              Add Comment
            </Button>
          </Box>
        )}

        {book.comments.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No comments yet. Be the first!
          </Typography>
        ) : (
          book.comments.map((c, index) => (
            <Box
              key={index}
              sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '6px' }}
            >
              <Typography fontWeight="bold">{c.user}</Typography>
              <Typography>{c.text}</Typography>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default BookDetails;
