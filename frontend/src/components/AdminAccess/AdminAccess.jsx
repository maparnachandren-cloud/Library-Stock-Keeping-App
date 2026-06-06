import { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Tabs, Tab,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Box, Alert, CircularProgress, Avatar
} from '@mui/material';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AssignmentReturnedOutlinedIcon from '@mui/icons-material/AssignmentReturnedOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';

/* ─── palette aligned with existing dark-navy app theme ─── */
const NAV_BG    = '#0f2236';
const SURFACE   = '#162d45';
const BORDER    = 'rgba(255,255,255,0.08)';
const ACCENT    = '#f5a623';
const TEXT_PRI  = '#e8f0fe';
const TEXT_SEC  = '#8baac8';

const headCellSx = {
  color: TEXT_SEC,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 600,
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  borderBottom: `1px solid ${BORDER}`,
  py: 1.5,
  px: 2.5,
  bgcolor: NAV_BG,
};

const bodyCellSx = {
  color: TEXT_PRI,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: '0.875rem',
  borderBottom: `1px solid ${BORDER}`,
  py: 1.6,
  px: 2.5,
};

const rowHoverSx = {
  transition: 'background 0.15s',
  '&:hover': { bgcolor: 'rgba(245,166,35,0.04)' },
  '&:last-child td': { borderBottom: 0 },
};

const AdminAccess = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users'),
        fetch('http://localhost:5000/api/requests')
      ]);
      const usersData = await usersRes.json();
      const requestsData = await requestsRes.json();
      setUsers(usersData);
      setRequests(requestsData);
      setLoading(false);
    } catch {
      setFetchError('Failed to load data. Make sure backend is running.');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateReq = async (reqId, bookId, status) => {
    if (!bookId) { alert('Cannot update — book data is missing.'); return; }
    await fetch(`http://localhost:5000/api/requests/${reqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, bookId })
    });
    fetchData();
  };

  const toggleBlock = async (id, isBlocked) => {
    await fetch(`http://localhost:5000/api/users/${id}/block`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlocked: !isBlocked })
    });
    fetchData();
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}'s account? This cannot be undone.`
    );
    if (!confirmed) return;
    const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) { alert(`${name}'s account has been deleted.`); fetchData(); }
    else { alert('Failed to delete user.'); }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <Box sx={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2
      }}>
        <CircularProgress sx={{ color: ACCENT }} size={40} thickness={3} />
        <Typography sx={{ color: TEXT_SEC, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem' }}>
          Loading admin data…
        </Typography>
      </Box>
    );
  }

  /* ── Error state ── */
  if (fetchError) {
    return <Container sx={{ mt: 4 }}><Alert severity="error" sx={{ bgcolor: 'rgba(211,47,47,0.18)', color: '#ff8a80', border: '1px solid rgba(211,47,47,0.45)', borderRadius: '10px', fontWeight: 500, '& .MuiAlert-icon': { color: '#ff8a80' } }}>{fetchError}</Alert></Container>;
  }

  /* ─── helpers ─── */
  const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColor = (name = '') => {
    const palette = ['#1e6fa5','#2a7d5e','#7b5ea7','#c47a20','#b03060','#2e7a8e'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return palette[Math.abs(h) % palette.length];
  };

  const statusChipSx = (color) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: '0.7rem',
    letterSpacing: '0.04em',
    height: 24,
    borderRadius: '6px',
    ...(color === 'success' && { bgcolor: 'rgba(46,160,67,0.18)', color: '#4caf7d', border: '1px solid rgba(46,160,67,0.3)' }),
    ...(color === 'error'   && { bgcolor: 'rgba(211,47,47,0.15)', color: '#f47c7c', border: '1px solid rgba(211,47,47,0.3)' }),
    ...(color === 'warning' && { bgcolor: 'rgba(245,166,35,0.15)', color: '#f5c842', border: '1px solid rgba(245,166,35,0.3)' }),
    ...(color === 'default' && { bgcolor: 'rgba(255,255,255,0.08)', color: TEXT_SEC, border: `1px solid ${BORDER}` }),
  });

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>

      {/* ── Page header ── */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: TEXT_PRI,
            letterSpacing: '-0.01em',
            mb: 0.5,
          }}
        >
          Admin Access
        </Typography>
        <Box sx={{ width: 48, height: 3, bgcolor: ACCENT, borderRadius: 2 }} />
      </Box>

      {/* ── Tabs ── */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          mb: 3,
          '& .MuiTabs-root': { minHeight: 40 },
          '& .MuiTab-root': {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: '0.82rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: TEXT_SEC,
            minHeight: 40,
            px: 0,
            mr: 4,
            transition: 'color 0.2s',
            '&.Mui-selected': { color: ACCENT },
          },
          '& .MuiTabs-indicator': {
            bgcolor: ACCENT,
            height: 2,
            borderRadius: 1,
          },
          '& .MuiTabs-flexContainer': { borderBottom: `1px solid ${BORDER}` },
        }}
      >
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleOutlinedIcon sx={{ fontSize: 16 }} />
              {`Users`}
              <Box component="span" sx={{
                bgcolor: tab === 0 ? ACCENT : 'rgba(255,255,255,0.1)',
                color: tab === 0 ? '#0f2236' : TEXT_SEC,
                fontSize: '0.68rem', fontWeight: 700,
                px: 0.9, py: 0.1, borderRadius: '10px', lineHeight: 1.6
              }}>{users.length}</Box>
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LibraryBooksOutlinedIcon sx={{ fontSize: 16 }} />
              {`Requests`}
              <Box component="span" sx={{
                bgcolor: tab === 1 ? ACCENT : 'rgba(255,255,255,0.1)',
                color: tab === 1 ? '#0f2236' : TEXT_SEC,
                fontSize: '0.68rem', fontWeight: 700,
                px: 0.9, py: 0.1, borderRadius: '10px', lineHeight: 1.6
              }}>{requests.length}</Box>
            </Box>
          }
        />
      </Tabs>

      {/* ══ USERS TAB ══ */}
      {tab === 0 && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {users.length === 0 ? (
            <Typography sx={{ p: 4, color: TEXT_SEC, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center' }}>
              No registered users yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {['Name', 'Email', 'Age', 'Phone', 'Education', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} sx={rowHoverSx}>

                    {/* Name with avatar */}
                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32, height: 32,
                            bgcolor: avatarColor(user.name),
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: TEXT_PRI }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: TEXT_SEC }}>{user.email}</TableCell>
                    <TableCell sx={bodyCellSx}>{user.age}</TableCell>
                    <TableCell sx={{ ...bodyCellSx, color: TEXT_SEC, fontVariantNumeric: 'tabular-nums' }}>{user.phone}</TableCell>

                    {/* Education badge */}
                    <TableCell sx={bodyCellSx}>
                      <Box component="span" sx={{
                        bgcolor: 'rgba(27,110,194,0.15)',
                        color: '#6ab0f5',
                        border: '1px solid rgba(27,110,194,0.25)',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        px: 1, py: 0.3,
                      }}>
                        {user.education}
                      </Box>
                    </TableCell>

                    {/* Status chip */}
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={user.isBlocked ? 'Blocked' : 'Active'}
                        size="small"
                        sx={statusChipSx(user.isBlocked ? 'error' : 'success')}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={user.isBlocked ? <CheckCircleOutlinedIcon sx={{ fontSize: '14px !important' }} /> : <BlockOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                          onClick={() => toggleBlock(user._id, user.isBlocked)}
                          sx={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            minWidth: 0,
                            ...(user.isBlocked
                              ? { borderColor: 'rgba(46,160,67,0.4)', color: '#4caf7d', '&:hover': { bgcolor: 'rgba(46,160,67,0.1)', borderColor: '#4caf7d' } }
                              : { borderColor: 'rgba(245,166,35,0.4)', color: '#f5c842', '&:hover': { bgcolor: 'rgba(245,166,35,0.1)', borderColor: '#f5c842' } }
                            ),
                          }}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                          onClick={() => handleDelete(user._id, user.name)}
                          sx={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            minWidth: 0,
                            borderColor: 'rgba(211,47,47,0.4)',
                            color: '#f47c7c',
                            '&:hover': { bgcolor: 'rgba(211,47,47,0.1)', borderColor: '#f47c7c' },
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

      {/* ══ REQUESTS TAB ══ */}
      {tab === 1 && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {requests.length === 0 ? (
            <Typography sx={{ p: 4, color: TEXT_SEC, fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'center' }}>
              No rental requests yet.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {['Student', 'Email', 'Book', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={headCellSx}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req._id} sx={rowHoverSx}>

                    {/* Student with avatar */}
                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          sx={{
                            width: 32, height: 32,
                            bgcolor: avatarColor(req.userId?.name || '?'),
                            fontSize: '0.7rem', fontWeight: 700,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {getInitials(req.userId?.name || '?')}
                        </Avatar>
                        <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: TEXT_PRI }}>
                          {req.userId?.name || 'Deleted User'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: TEXT_SEC }}>{req.userId?.email || '—'}</TableCell>

                    {/* Book title */}
                    <TableCell sx={bodyCellSx}>
                      <Typography sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.88rem',
                        color: req.bookId?.title ? TEXT_PRI : TEXT_SEC,
                        fontStyle: req.bookId?.title ? 'normal' : 'italic',
                      }}>
                        {req.bookId?.title || 'Deleted Book'}
                      </Typography>
                    </TableCell>

                    {/* Status chip */}
                    <TableCell sx={bodyCellSx}>
                      <Chip
                        label={req.status}
                        size="small"
                        sx={statusChipSx(
                          req.status === 'Approved' ? 'success' :
                          req.status === 'Pending'  ? 'warning' :
                          req.status === 'Rejected' ? 'error'   : 'default'
                        )}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {req.status === 'Pending' && (
                          <>
                            <Button
                              variant="outlined" size="small"
                              startIcon={<ThumbUpOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                              onClick={() => updateReq(req._id, req.bookId?._id, 'Approved')}
                              disabled={!req.bookId?._id}
                              sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 600, fontSize: '0.72rem',
                                textTransform: 'none', letterSpacing: '0.02em',
                                borderRadius: '8px', px: 1.5, py: 0.5, minWidth: 0,
                                borderColor: 'rgba(46,160,67,0.4)', color: '#4caf7d',
                                '&:hover': { bgcolor: 'rgba(46,160,67,0.1)', borderColor: '#4caf7d' },
                                '&:disabled': { opacity: 0.35 },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined" size="small"
                              startIcon={<ThumbDownOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                              onClick={() => updateReq(req._id, req.bookId?._id, 'Rejected')}
                              disabled={!req.bookId?._id}
                              sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 600, fontSize: '0.72rem',
                                textTransform: 'none', letterSpacing: '0.02em',
                                borderRadius: '8px', px: 1.5, py: 0.5, minWidth: 0,
                                borderColor: 'rgba(211,47,47,0.4)', color: '#f47c7c',
                                '&:hover': { bgcolor: 'rgba(211,47,47,0.1)', borderColor: '#f47c7c' },
                                '&:disabled': { opacity: 0.35 },
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {req.status === 'Approved' && (
                          <Button
                            variant="outlined" size="small"
                            startIcon={<AssignmentReturnedOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                            onClick={() => updateReq(req._id, req.bookId?._id, 'Returned')}
                            disabled={!req.bookId?._id}
                            sx={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontWeight: 600, fontSize: '0.72rem',
                              textTransform: 'none', letterSpacing: '0.02em',
                              borderRadius: '8px', px: 1.5, py: 0.5, minWidth: 0,
                              borderColor: 'rgba(245,166,35,0.4)', color: '#f5c842',
                              '&:hover': { bgcolor: 'rgba(245,166,35,0.1)', borderColor: '#f5c842' },
                              '&:disabled': { opacity: 0.35 },
                            }}
                          >
                            Returned
                          </Button>
                        )}
                        {(req.status === 'Rejected' || req.status === 'Returned') && (
                          <Typography sx={{ color: TEXT_SEC, fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic' }}>
                            No actions
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}

    </Container>
  );
};

export default AdminAccess;