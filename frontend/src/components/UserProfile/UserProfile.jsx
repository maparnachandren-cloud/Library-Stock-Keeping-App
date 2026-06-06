import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Alert, Card, CardContent, Divider, Avatar, TableContainer
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

  // Glassmorphism input styling
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
      transition: 'all 0.3s ease',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
      '&.Mui-focused fieldset': { 
        borderColor: '#64b5f6', // Light Monochromatic Blue
        boxShadow: '0 0 10px rgba(100, 181, 246, 0.3)' 
      },
    },
    '& .MuiInputBase-input': { color: '#e3f2fd', padding: '10px 14px' }, // Soft ice-blue text
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.6)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#64b5f6' },
    '& .MuiFormHelperText-root': { color: 'rgba(255, 255, 255, 0.5)', margin: '3px 14px 0' }
  };

  // Reusable typography style for the details section
  const detailLabelStyle = { color: 'rgba(255, 255, 255, 0.6)', mb: 0 };
  const detailValueStyle = { color: '#e3f2fd', display: 'flex', alignItems: 'center', gap: 1 };
  const detailIconStyle = { color: '#64b5f6' };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#ffffff' }}>
          My Profile
        </Typography>
        <Chip 
          icon={<BookIcon style={{ color: '#64b5f6' }}/>} 
          label={`Currently Rented: ${rentedCount}`} 
          variant="outlined" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#e3f2fd', 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)'
          }} 
        />
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(46,160,67,0.18)', color: '#69db7c', border: '1px solid rgba(46,160,67,0.45)', borderRadius: '10px', fontWeight: 500, '& .MuiAlert-icon': { color: '#69db7c' } }}>{successMsg}</Alert>}

      {/* Profile Card - Glassmorphism Applied */}
      <Card
  elevation={0}
  sx={{
    maxWidth: 550,
    mx: 'auto',
    mb: 4,
    borderRadius: '28px',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    overflow: 'hidden'
  }}
>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <Box
  sx={{
    height: 5,
    width: '100%',
    borderRadius: 5,
    mb: 3,
    background:
      'linear-gradient(90deg,#1565c0,#42a5f5,#90caf9)'
  }}
/> 
          {/* Avatar Area with Glow */}
        
          <Avatar
  sx={{
    width: 110,
    height: 110,
    mb: 2,
    fontSize: '3rem',
    color: '#fff',
    background:
      'linear-gradient(135deg,#1565c0,#42a5f5)',
    border: '4px solid rgba(255,255,255,0.15)',
    boxShadow:
      '0 10px 30px rgba(25,118,210,0.4)',
    transition: '0.3s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }}
>
            {formData.name ? formData.name.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
          </Avatar>
          

          {!editMode ? (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                onClick={() => setEditMode(true)} 
                size="small"
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  mb: 2, 
                  color: '#64b5f6', 
                  borderColor: 'rgba(100, 181, 246, 0.5)',
                  '&:hover': { borderColor: '#64b5f6', background: 'rgba(100, 181, 246, 0.1)' }
                }}
              >
                Edit Profile
              </Button>

              <Divider sx={{ width: '100%', mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              {/* Tighter Vertical Stack of Details */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5, px: { xs: 0, sm: 2 } }}>
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Name</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <PersonIcon fontSize="small" sx={detailIconStyle} /> {formData.name || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Email</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <EmailIcon fontSize="small" sx={detailIconStyle} /> {formData.email || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Phone</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <PhoneIcon fontSize="small" sx={detailIconStyle} /> {formData.phone || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Age</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <AgeIcon fontSize="small" sx={detailIconStyle} /> {formData.age || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Location</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <LocationOnIcon fontSize="small" sx={detailIconStyle} /> {formData.place || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" display="block" sx={detailLabelStyle}>Education</Typography>
                  <Typography variant="body1" fontWeight="500" sx={detailValueStyle}>
                    <SchoolIcon fontSize="small" sx={detailIconStyle} /> {formData.education || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box component="form" noValidate sx={{ width: '100%', mt: 1 }}>
             <Typography
  variant="h6"
  sx={{
    mb: 3,
    mt: -1.5,
    textAlign: 'center',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#ffffff',
    textShadow: '0 0 12px rgba(100,181,246,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  }}
>
  <EditIcon
    sx={{
      color: '#64b5f6',
      fontSize: 25,
      filter: 'drop-shadow(0 0 6px rgba(100,181,246,0.6))',
    }}
  />
  Update Your Details
</Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2, py: 0, bgcolor: 'rgba(211,47,47,0.18)', color: '#ff8a80', border: '1px solid rgba(211,47,47,0.45)', borderRadius: '10px', fontWeight: 500, '& .MuiAlert-icon': { color: '#ff8a80' } }}>{error}</Alert>}

              {/* Form Fields Array with Ghost Inputs */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                  fullWidth label="Full Name" value={formData.name} size="small"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  helperText="Letters only" sx={textFieldStyles}
                />
                
                <TextField
                  fullWidth label="Email Address" type="email" value={formData.email} size="small"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={textFieldStyles}
                />
                
                <TextField
  fullWidth
  label="Phone Number"
  type="tel"
  value={formData.phone}
  size="small"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  }}
  inputProps={{
    maxLength: 10,
    inputMode: 'numeric',
  }}
  helperText="10 digit phone number"
  sx={textFieldStyles}
/>
                
                <TextField
  fullWidth
  label="Age"
  type="number"
  value={formData.age}
  size="small"
  onChange={(e) => {
    const value = e.target.value;

    if (
      value === '' ||
      (Number(value) >= 1 && Number(value) <= 120)
    ) {
      setFormData({ ...formData, age: value });
    }
  }}
  inputProps={{
    min: 1,
    max: 120,
    step: 1,
  }}
  helperText="Between 1 and 120"
  sx={textFieldStyles}
/>
                
                <TextField
                  fullWidth label="Place" value={formData.place} size="small"
                  helperText="Letters, spaces, hyphens only"
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  sx={textFieldStyles}
                />
                
                <TextField
                  fullWidth label="Education" value={formData.education} size="small"
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  sx={textFieldStyles}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<CloseIcon />} 
                  onClick={() => { setEditMode(false); setError(''); }}
                  size="small"
                  sx={{ color: '#e3f2fd', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#ffffff' } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleUpdate}
                  size="small"
                  sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Requests Section */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#ffffff' }}>
        Rental History
      </Typography>

      {requests.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2 
          }}
        >
          <BookIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.5)', mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#e3f2fd' }}>You have no rental requests yet.</Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            borderRadius: 2, 
            background: 'rgba(255, 255, 255, 0.07)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }}}>
                  <TableCell sx={{ color: '#e3f2fd', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{req.bookId?.title || 'Book deleted'}</TableCell>
                  <TableCell sx={{ color: '#e3f2fd', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{req.bookId?.author || '-'}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Chip
                      label={req.status}
                      color={getStatusChipColor(req.status)}
                      size="small"
                      sx={{ fontWeight: '500' }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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