 import { useState, useEffect } from 'react';

import {
  useParams
} from 'react-router-dom';

import {
  Container,
  Typography,
  Button,
  TextField,
  Box
} from '@mui/material';

const BookDetails = ({
  currentUser
}) => {

  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState('');

  useEffect(() => {

    fetch(
      `http://localhost:5000/api/books/${id}`
    )
      .then((res) => res.json())
      .then(setBook);

  }, [id]);

  const refreshBook = async () => {

    const updated = await (
      await fetch(
        `http://localhost:5000/api/books/${id}`
      )
    ).json();

    setBook(updated);
  };

  const averageRating = () => {

    if (!book.ratings.length) {
      return 0;
    }

    return (
      book.ratings.reduce(
        (a, b) => a + b.value,
        0
      ) / book.ratings.length
    ).toFixed(1);
  };

  const handleRent = async () => {

    await fetch(
      `http://localhost:5000/api/books/${id}/rent`,
      {
        method: 'PUT'
      }
    );

    refreshBook();
  };

  const handleRate = async () => {

    await fetch(
      `http://localhost:5000/api/books/${id}/rate`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: currentUser._id,
          value: Number(rating)
        })
      }
    );

    refreshBook();
  };

  const handleComment = async () => {

    await fetch(
      `http://localhost:5000/api/books/${id}/comment`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          user: currentUser.name,
          text: comment
        })
      }
    );

    setComment('');

    refreshBook();
  };

  const handleLike = async () => {

    await fetch(
      `http://localhost:5000/api/books/${id}/like`,
      {
        method: 'POST'
      }
    );

    refreshBook();
  };

  if (!book) return null;

  return (
    <Container sx={{ mt: 4 }}>

      <img
        src={book.coverImage}
        alt={book.title}
        width="250"
      />

      <Typography variant="h4">
        {book.title}
      </Typography>

      <Typography>
        Author: {book.author}
      </Typography>

      <Typography>
        Genre: {book.genre}
      </Typography>

      <Typography>
        ₹ {book.price}
      </Typography>

      <Typography>
        {book.description}
      </Typography>

      <Typography>
        Status:
        {' '}
        {book.isAvailable
          ? 'Available'
          : 'Rented'}
      </Typography>

      <Typography>
        Rating:
        {' '}
        {averageRating()}
        ⭐
      </Typography>

      <Typography>
        Likes:
        {' '}
        {book.likes}
      </Typography>

      <Button
        variant="contained"
        disabled={!book.isAvailable}
        onClick={handleRent}
        sx={{ mt: 2 }}
      >
        Rent Book
      </Button>

      <Button
        onClick={handleLike}
        sx={{ ml: 2, mt: 2 }}
      >
        Like
      </Button>

      <Box sx={{ mt: 4 }}>

        <Typography variant="h6">
          Rate this book
        </Typography>

        <TextField
          type="number"
          inputProps={{
            min: 1,
            max: 5
          }}
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
        />

        <Button onClick={handleRate}>
          Submit Rating
        </Button>

      </Box>

      <Box sx={{ mt: 4 }}>

        <Typography variant="h6">
          Comments
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <Button
          onClick={handleComment}
          sx={{ mt: 2 }}
        >
          Add Comment
        </Button>

        {book.comments.map((c, index) => (

          <Box
            key={index}
            sx={{
              mt: 2,
              p: 2,
              border: '1px solid #ccc'
            }}
          >

            <Typography fontWeight="bold">
              {c.user}
            </Typography>

            <Typography>
              {c.text}
            </Typography>

          </Box>

        ))}

      </Box>

    </Container>
  );
};

export default BookDetails;