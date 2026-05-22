import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Button, Chip } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const books = [
    {
      id: "Bk01",
      title: "Atomic Habits",
      author: "James Clear",
      pYear: 2018,
      genre: "Self Help Book",
      status: "Available",
      coverUrl:"/images/atomichabit.jpg" 
    },
    {
      id: "Bk02",
      title: "Harry Potter",
      author: "J.K Rowling",
      genre: "Fantasy",
      pYear: 1997,
      status: "Rented",
      coverUrl:"/images/harrypotter.jpg"
    },
    {
      id: "Bk03",
      title: "The Alchemist",
      author: "Paulo Coelho",
      pYear: 1988,
      genre: "Adventure Fiction",
      status: "Available",
      coverUrl:"/images/alchemist.jpg"
    },
    {
      id: "Bk04",
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      pYear: 1997,
      genre: "Finance",
      status: "Rented",
      coverUrl:"/images/rich dad.jpg"
    },
    {  
      id: "Bk05",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      pYear: 2020,
      genre: "Finance",
      status: "Available",
      coverUrl:"/images/money.jpg"
    },
    {
     id: "Bk06",
     title: "Ikigai",
     author: "Hector Garcia",
     pYear:2016,
     genre:"Self Help",
     status: "Available",
     coverUrl:"/images/ikgai.jpg"
   },
   {
     id: "Bk07",
     title: "Wings of Fire",
     author: "A.P.J Abdul Kalam",
     pYear:1999,
     genre:"Autobiography",
     status: "Rented",
     coverUrl:"/images/wingsoffire.jpg"
    },
    {
     id: "Bk08",
     title: "The Hobbit",
     author: "J.R.R Tolkien",
     pYear:1937,
     genre:"Fantasy",
     status: "Available",
     coverUrl:"/images/hobbit.jpg"
    },
    {
     id: "Bk09",
     title: "Murder on the Orient Express",
     author: "Agatha Christie",
     pYear: 1934,
     genre:"Crime Thriler",
     status: "Available",
     coverUrl:"/images/express.jpg"
    },
    {
     id: "Bk10",
     title: "The Girk with the Dragon Tattoo",
     author: "Stieg Larsson",
     pYear:2005,
     genre:"Crime Fiction",
     status: "Rented",
     coverUrl:"/images/murdertattoo.jpg"
    },
  ];
  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
            Discover Books
          </Typography>
        </Box> 

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)"
            },
            gap: 3
          }}
        >
          {books.map((book) => (
            <Box
              key={book.id}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                bgcolor: "#fff",
                transition: "0.2s",
                display: "flex", 
                height: "180px", 
                border: "1px solid #f0f0f0",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 6px 16px rgba(0,0,0,0.1)"
                }
              }}
            >
              <Box 
                sx={{ 
                  width: "130px", 
                  height: "100%", 
                  overflow: "hidden", 
                  bgcolor: "#ffffff", 
                  position: "relative",
                  flexShrink: 0
                }}
              >
                <Chip
                  label={book.status}
                  color={book.status === "Available" ? "success" : "error"}
                  size="small"
                  sx={{ 
                    position: "absolute", 
                    bottom: 8, 
                    left: 8, 
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    height: "20px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.2)", 
                    zIndex: 2,
                    borderRadius: "4px"
                  }}
                />
                <img
                  src={book.coverUrl} 
                  alt={book.title}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Box>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1, minWidth: 0 }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.2,
                      mb: 0.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {book.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {book.author}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <Typography variant="caption" color="text.disabled">
                    Year: {book.pYear}
                  </Typography>

                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => navigate('/bookdetails', { state: book })}
                    sx={{ 
                      fontWeight: 600, 
                      bgcolor: "#1a1a1a",
                      color: "#fff",
                      px: 2,
                      textTransform: "none",
                      borderRadius: "6px",
                      "&:hover": {
                        bgcolor: "#333333"
                      }
                    }}
                  >
                    Details
                  </Button>
                </Box>

              </Box>

            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;