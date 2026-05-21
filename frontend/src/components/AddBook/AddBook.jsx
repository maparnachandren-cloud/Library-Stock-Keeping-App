
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";


const AddBook = () => {
  
  
  return (
    <Paper
      elevation={3}
      style={{
        width: "400px",
        margin: "50px auto",
        padding: "30px",
      }}
    >
      <h2>Add New Book</h2>

      <form
        onSubmit
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <TextField
          label="Book Title"
          name="title"
          onChange
          fullWidth
        />

        <TextField
          label="Author Name"
          name="author"
          onChange
          fullWidth
        />

        <TextField
          label="Publication Year"
          name="pYear"
          onChange
          fullWidth
        />

        <TextField
          label="Genre"
          name="genre"
          onChange
          fullWidth
        />

        <TextField
          label="ISBN"
          name="isbn"
          onChange
          fullWidth
        />

        <TextField
          select
          label="Status"
          name="status"
          onChange
          fullWidth
        >
          <MenuItem value="Available">
            Available
          </MenuItem>

          <MenuItem value="Rented">
            Rented
          </MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          Add Book
        </Button>
      </form>
    </Paper>
  );
};

export default AddBook;