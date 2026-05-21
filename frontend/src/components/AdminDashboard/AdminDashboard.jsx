import React from 'react'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
   const books = [
    {
      id:"Bk01",
      title: "Atomic Habits",
      author: "James Clear",
      pYear:2018,
      genre:"Self Help Book",
      isbn:9781847941831,
      status: "Available",
    },
    {
      id:"Bk02",
      title: "Harry Potter",
      author: "J.K Rowling",
      pYear:1997,
      genre:"Fantasy",
      isbn:9781408855652,
      status: "Rented"
    },
    {
    id:"Bk03",
    title: "The Alchemist",
    author: "Paulo Coelho",
    pYear:1988,
    genre:"Adventure Fiction",
    isbn:9780061122415,
    status: "Available"
    },
    {
    id:"Bk04",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    pYear:1997,
    genre:"Finance",
    isbn:9781612680194,
    status: "Rented",
},

{
    id:"Bk05",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    pYear:2020,
    genre:"Finance",
    isbn:9780857197689,
    status: "Available",
},

{
    id:"Bk06",
    title: "Ikigai",
    author: "Hector Garcia",
    pYear:2016,
    genre:"Self Help",
    isbn:9781786330895,
    status: "Available",
},
{
    id:"Bk07",
    title: "Wings of Fire",
    author: "A.P.J Abdul Kalam",
    pYear:1999,
    genre:"Autobiography",
    isbn:9788173711466,
    status: "Rented",
},
{
    id:"Bk08",
    title: "The Hobbit",
    author: "J.R.R Tolkien",
    pYear:1937,
    genre:"Fantasy",
    isbn:9780547928227,
    status: "Available",
},
{
    id:"Bk09",
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    pYear:1934,
    genre:"Crime Thriller",
    isbn:9780062693662,
    status: "Available"
},
{
    id:"Bk10",
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    pYear:2005,
    genre:"Crime Fiction",
    isbn:9780307454546,
    status: "Available"
},
{
    id:"Bk11",
    title: "The Godfather",
    author: "Mario Puzo",
    pYear:1969,
    genre:"Crime Drama",
    isbn:9780451205766,
    status: "Rented"
},
{
    id:"Bk12",
    title: "Frankenstein",
    author: "Mary Shelley",
    pYear:1818,
    genre:"Horror",
    isbn:9780486282114,
    status: "Available"
},
{
    id:"Bk13",
    title: "The Shining",
    author: "Stephen King",
    pYear:1977,
    genre:"Psychological Horror",
    isbn:9780307743657,
    status: "Available"
},
{
    id:"Bk14",
    title: "IT",
    author: "Stephen King",
    pYear:1986,
    genre:"Horror",
    isbn:9781501142970,
    status: "Rented"
},
{
    id:"Bk15",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pYear:1813,
    genre:"Romance",
    isbn:9781503290563,
    status: "Available"
},
{
    id:"Bk16",
    title: "The Notebook",
    author: "Nicholas Sparks",
    pYear:1996,
    genre:"Romance",
    isbn:9780446605236,
    status: "Available"
},
{
    id:"Bk17",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    pYear:2003,
    genre:"Action Thriller",
    isbn:9780307474278,
    status: "Available"
},
{
    id:"Bk18",
    title: "Mission Impossible",
    author: "Jim Phelps",
    pYear:1988,
    genre:"Action Spy Thriller",
    isbn:9780671638108,
    status: "Available"
},
{
    id:"Bk19",
    title: "Dune",
    author: "Frank Herbert",
    pYear:1965,
    genre:"Science Fiction",
    isbn:9780441172719,
    status: "Rented"
},
{
    id:"Bk20",
    title: "1984",
    author: "George Orwell",
    pYear:1949,
    genre:"Dystopian Science Fiction",
    isbn:9780451524935,
    status: "Available"
}
  ];

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      {/* Top Buttons */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <Link to="/addbook">
        <Button
          variant="contained"
          color="primary"
          onClick
        >
          Add New Book
        </Button>
        </Link>

        
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell><b>Book ID</b></TableCell>
              <TableCell><b>Book Title</b></TableCell>
              <TableCell><b>Author</b></TableCell>
              <TableCell><b>Publication Year</b></TableCell>
              <TableCell><b>Genre</b></TableCell>
              <TableCell><b>ISBN</b></TableCell>
              <TableCell><b>Rental Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>

                <TableCell>{book.id}</TableCell>

                <TableCell>{book.title}</TableCell>

                <TableCell>{book.author}</TableCell>

                <TableCell>{book.pYear}</TableCell>

                <TableCell>{book.genre}</TableCell>

                <TableCell>{book.isbn}</TableCell>

                <TableCell>{book.status}</TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminDashboard;