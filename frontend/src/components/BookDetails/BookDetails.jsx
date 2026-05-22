import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Chip, Grid } from "@mui/material";

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state;
  if (!book) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>No book details found.</Typography>
        <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: "#1a1a1a" }}>
          Go Back Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Button 
          onClick={() => navigate(-1)} 
          sx={{ color: "#1a1a1a", fontWeight: 600, mb: 4, textTransform: "none" }}
        >
          ← Back to list
        </Button>
        <Box 
          sx={{ 
            bgcolor: "#ffffff", 
            borderRadius: "16px", 
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)", 
            overflow: "hidden",
            p: { xs: 3, md: 5 }
          }}
        >
          <Grid container spacing={4}>
            
            <Grid item xs={12} md={4} display="flex" justifyContent="center">
              <Box 
                sx={{ 
                  width: "100%", 
                  maxWidth: "200px", 
                  height: "280px", 
                  borderRadius: "8px", 
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  bgcolor: "#ffffff"
                }}
              >
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8} display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Chip 
                  label={book.status} 
                  color={book.status === "Available" ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: "4px", mb: 2 }}
                />
                
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a", mb: 1, lineHeight: 1.2 }}>
                  {book.title}
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 3 }}>
                  by {book.author}
                </Typography>

                <hr style={{ border: "0", borderTop: "1px solid #f0f0f0", marginBottom: "20px" }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography variant="body1">
                    <strong>Genre:</strong> {book.genre || "Not Specified"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Published Year:</strong> {book.pYear}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Book ID:</strong> {book.id}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  disabled={book.status !== "Available"}
                  sx={{ 
                    bgcolor: "#1a1a1a", 
                    color: "#fff", 
                    px: 4, 
                    py: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "8px",
                    "&:hover": { bgcolor: "#333333" }
                  }}
                >
                  {book.status === "Available" ? "Rent this Book" : "Currently Unavailable"}
                </Button>
              </Box>

            </Grid>
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default BookDetails;