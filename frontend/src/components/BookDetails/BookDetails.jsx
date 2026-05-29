import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Alert
} from '@mui/material';

const BookDetails = ({ currentUser }) => {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [userRequest, setUserRequest] = useState(null); // this user's request for this book
  const [message, setMessage] = useState('');

  // Fetch book data
  const fetchBook = async () => {
    const res = await fetch(`http://localhost:5000/api/books/${id}`);
    const data = await res.json();
    setBook(data);
  };

  // Fetch this user's existing requests to check status for this book
  const fetchUserRequest = async () => {
    if (currentUser.role === 'admin') return; // admin doesn't rent
    const res = await fetch(
      `http://localhost:5000/api/users/${currentUser._id}/requests`
    );
    const requests = await res.json();
    // Find if any request exists for this specific book
    const found = requests.find(
      (r) => r.bookId?._id === id || r.bookId === id
    );
    setUserRequest(found || null);
  };

  useEffect(() => {
    fetchBook();
    fetchUserRequest();
  }, [id]);

  // Pre-fill rating input with user's existing rating if any
  useEffect(() => {
    if (book && currentUser) {
      const existing = book.ratings.find(
        (r) => r.userId === currentUser._id
      );
      if (existing) setRating(existing.value);
    }
  }, [book]);

  const refreshAll = async () => {
    await fetchBook();
    await fetchUserRequest();
  };

  // Compute average rating
  const averageRating = () => {
    if (!book || !book.ratings || book.ratings.length === 0) return null;
    const avg = book.ratings.reduce((a, b) => a + b.value, 0) / book.ratings.length;
    return avg.toFixed(1);
  };

  // Check if current user has liked this book
  const hasLiked = () => {
    if (!book || !currentUser) return false;
    return book.likedBy?.includes(currentUser._id);
  };

  // Determine rent button label and disabled state
  const getRentButtonProps = () => {
    if (!book) return { label: 'Loading...', disabled: true };

    if (userRequest) {
      if (userRequest.status === 'Pending') {
        return { label: 'Request Pending', disabled: true };
      }
      if (userRequest.status === 'Approved') {
        return { label: 'Currently Rented by You', disabled: true };
      }
      if (userRequest.status === 'Rejected') {
        return { label: 'Re-request', disabled: false };
      }
      if (userRequest.status === 'Returned') {
        return { label: 'Rent Again', disabled: !book.isAvailable };
      }
    }

    if (!book.isAvailable) {
      return { label: 'Book Unavailable', disabled: true };
    }

    return { label: 'Rent Book', disabled: false };
  };

  const handleRent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          bookId: id
        })
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
    if (!rating || rating < 1 || rating > 5) {
      alert('Please enter a rating between 1 and 5');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser._id,
          value: Number(rating)
        })
      });
      if (res.ok) {
        setMessage('Rating submitted!');
        await fetchBook();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      alert('Connection error');
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser.name,
          text: comment
        })
      });
      if (res.ok) {
        setComment('');
        await fetchBook();
      }
    } catch {
      alert('Connection error');
    }
  };

  if (!book) return null;

  const avg = averageRating();
  const rentBtn = getRentButtonProps();

  return (
    <Container sx={{ mt: 4 }}>

      <img
        src={book.coverImage}
        alt={book.title}
        width="250"
        style={{ borderRadius: '8px' }}
      />

      <Typography variant="h4" sx={{ mt: 2 }}>
        {book.title}
      </Typography>

      <Typography>Author: {book.author}</Typography>
      <Typography>Genre: {book.genre}</Typography>
      {book.isbn && <Typography>ISBN: {book.isbn}</Typography>}
      {book.publicationYear && (
        <Typography>Publication Year: {book.publicationYear}</Typography>
      )}
      <Typography>₹ {book.price}</Typography>
      <Typography sx={{ mt: 1 }}>{book.description}</Typography>

      <Typography sx={{ mt: 1 }}>
        Status: {book.isAvailable ? 'Available' : 'Rented'}
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

      {/* Rent and Like buttons — admin cannot rent or like */}
      {currentUser.role !== 'admin' && (
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={rentBtn.disabled}
            onClick={handleRent}
          >
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

      {/* Rate this book — admin cannot rate */}
      {currentUser.role !== 'admin' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Rate this book</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <TextField
              type="number"
              label="Your Rating"
              inputProps={{ min: 1, max: 5 }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              sx={{ width: 120 }}
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

      {/* Comments section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">
          Comments ({book.comments.length})
        </Typography>

        {/* Add comment — admin cannot comment */}
        {currentUser.role !== 'admin' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleComment}
              disabled={!comment.trim()}
              sx={{ mt: 1 }}
            >
              Add Comment
            </Button>
          </Box>
        )}

        {/* Display all comments */}
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
