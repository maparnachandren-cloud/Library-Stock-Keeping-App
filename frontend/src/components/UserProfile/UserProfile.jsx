import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Alert, Grid, Card, CardContent, Divider, Avatar, TableContainer
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Cake as AgeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const UserProfile = ({ currentUser, setCurrentUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', phone: '', place: '', education: ''
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          phone: data.phone || '',
          place: data.place || '',
          education: data.education || ''
        });
      });

    fetchRequests();
  }, [currentUser._id]);

  const fetchRequests = () => {
    fetch(`http://localhost:5000/api/users/${currentUser._id}/requests`)
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => setRequests([]));
  };

  const handleUpdate = async () => {
    setError('');
    setSuccessMsg('');

    // Name — letters only
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError('Name should only contain letters');
      return;
    }

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Age
    if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      setError('Age must be between 1 and 120');
      return;
    }

    // Phone — exactly 10 digits
    if (formData.phone.toString().length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Place — letters, spaces, commas, hyphens only
    if (!formData.place.trim() || !/^[a-zA-Z\s,\-.]+$/.test(formData.place.trim())) {
      setError('Place should only contain letters, spaces, or hyphens');
      return;
    }

    const res = await fetch(`http://localhost:5000/api/users/${currentUser._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const updatedUser = await res.json();

    if (res.ok) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setEditMode(false);
      setSuccessMsg('Profile updated successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setError(updatedUser.message || 'Failed to update profile');
    }
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm('Are you sure you want to cancel this request?');
    if (!confirmed) return;
    await fetch(`http://localhost:5000/api/requests/${id}`, { method: 'DELETE' });
    fetchRequests();
  };

  const handleReRequest = async (bookId) => {
    const res = await fetch('http://localhost:5000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser._id, bookId })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Rent request submitted again!');
      fetchRequests();
    } else {
      alert(data.message || 'Failed to submit request');
    }
  };

  const rentedCount = requests.filter((r) => r.status === 'Approved').length;

  const getStatusChipColor = (status) => {
    if (status === 'Approved') return 'success';
    if (status === 'Pending') return 'warning';
    if (status === 'Rejected') return 'error';
    return 'default';
  };

  // Helper style for forced black text in inputs
  const textFieldStyles = {
    '& .MuiInputBase-input': { color: '#000000' },
    '& .MuiInputLabel-root': { color: '#333333' },
    '& .MuiFormHelperText-root': { color: '#555555' }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#000000' }}>
          My Profile
        </Typography>
        <Chip 
          icon={<BookIcon />} 
          label={`Currently Rented: ${rentedCount}`} 
          color="primary" 
          variant="outlined" 
          sx={{ fontWeight: 'bold', color: '#000000', borderColor: '#000000' }} 
        />
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      {/* Profile Card */}
      <Card elevation={3} sx={{ mb: 5, borderRadius: 3, bgcolor: '#ffffff' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {!editMode ? (
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', mb: 2, fontSize: '3rem', color: '#ffffff' }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                </Avatar>
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />} 
                  onClick={() => setEditMode(true)} 
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Edit Profile
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Name</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <PersonIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.name || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Email</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <EmailIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.email || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Phone</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <PhoneIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.phone || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Age</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <AgeIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.age || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Location</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <LocationOnIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.place || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ color: '#333333' }}>Education</Typography>
                    <Typography variant="body1" fontWeight="500" display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                      <SchoolIcon fontSize="small" sx={{ color: '#333333' }} /> {formData.education || 'Not provided'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Box component="form" noValidate>
              <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1} sx={{ color: '#000000' }}>
                <EditIcon color="primary" /> Update Your Details
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Full Name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    helperText="Letters only"
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Email Address" type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Phone Number" type="number" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    inputProps={{ min: 1000000000, max: 9999999999 }}
                    helperText="10 digit phone number"
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Age" type="number" value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    inputProps={{ min: 1, max: 120 }}
                    helperText="Between 1 and 120"
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Place" value={formData.place}
                    helperText="Letters, spaces, hyphens only"
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    sx={textFieldStyles}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Education" value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CloseIcon />} 
                  onClick={() => { setEditMode(false); setError(''); }}
                  sx={{ color: '#000000', borderColor: '#000000' }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleUpdate}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4, borderColor: '#cccccc' }} />

      {/* Requests Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
        Rental History
      </Typography>

      {requests.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <BookIcon sx={{ fontSize: 48, color: '#666666', mb: 1 }} />
          <Typography sx={{ color: '#333333' }}>You have no rental requests yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, bgcolor: '#ffffff' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ bgcolor: '#eeeeee' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#000000' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', color: '#000000' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id} hover>
                  <TableCell sx={{ color: '#000000' }}>{req.bookId?.title || 'Book deleted'}</TableCell>
                  <TableCell sx={{ color: '#000000' }}>{req.bookId?.author || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={req.status}
                      color={getStatusChipColor(req.status)}
                      size="small"
                      sx={{ fontWeight: '500' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    {req.status === 'Pending' && (
                      <Button 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={() => handleCancel(req._id)}
                      >
                        Cancel
                      </Button>
                    )}
                    {req.status === 'Rejected' && req.bookId?._id && (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        startIcon={<RefreshIcon />}
                        onClick={() => handleReRequest(req.bookId._id)}
                      >
                        Re-request
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UserProfile;