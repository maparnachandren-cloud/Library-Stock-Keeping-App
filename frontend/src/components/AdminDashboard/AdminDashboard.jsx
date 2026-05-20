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
      isbn:978-1847941831,
      status: "Available",
    },
    {
      id:"Bk02",
      title: "Harry Potter",
      author: "J.K Rowling",
      pYear:1997,
      genre:"Fantasy",
      isbn:978-1408855652,
      status: "Rented"
    },
    {
    id:"Bk03",
    title: "The Alchemist",
    author: "Paulo Coelho",
    pYear:1988,
    genre:"Adventure Fiction",
    isbn:978-61122415,
    status: "Available"
    },
    {
    id:"Bk04",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    pYear:1997,
    genre:"Finance",
    isbn:978-1612680194,
    status: "Rented",
},

{
    id:"Bk05",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    pYear:2020,
    genre:"Finance",
    isbn:978-857197689,
    status: "Available",
},

{
    id:"Bk06",
    title: "Ikigai",
    author: "Hector Garcia",
    pYear:2016,
    genre:"Self Help",
    isbn:978-1786330895,
    status: "Available",
},
{
    id:"Bk07",
    title: "Wings of Fire",
    author: "A.P.J Abdul Kalam",
    pYear:1999,
    genre:"Autobiography",
    isbn:978-8173711466,
    status: "Rented",
},
{
    id:"Bk08",
    title: "The Hobbit",
    author: "J.R.R Tolkien",
    pYear:1937,
    genre:"Fantasy",
    isbn:978-547928227,
    status: "Available",
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