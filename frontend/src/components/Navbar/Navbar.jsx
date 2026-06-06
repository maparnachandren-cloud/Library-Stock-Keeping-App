import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Badge, Popover, Tabs, Tab,
  List, ListItem, ListItemText, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';

const navButtonStyle = {
  borderRadius: '20px',
  px: 2,
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    transform: 'translateY(-2px)',
  },
};

const Navbar = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifTab, setNotifTab] = useState(0); // 0 = Unread, 1 = All

  const isUserPage =
    currentUser &&
    currentUser.role !== 'admin' &&
    (location.pathname === '/home' ||
      location.pathname.startsWith('/book/') ||
      location.pathname === '/profile');

  // Fetch notifications when on user pages
  useEffect(() => {
    if (isUserPage) {
      fetchNotifications();
    }
  }, [location.pathname, currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser || currentUser.role === 'admin') return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/notifications`
      );
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    }
  };

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleMarkOneRead = async (notifId) => {
    try {
      await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/notifications/${notifId}/read`,
        { method: 'PUT' }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
    } catch {
      // silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/users/${currentUser._id}/notifications/readall`,
        { method: 'PUT' }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent fail
    }
  };

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setNotifications([]);
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (!currentUser) navigate('/');
    else if (currentUser.role === 'admin') navigate('/admin/dashboard');
    else navigate('/home');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadList = notifications.filter((n) => !n.isRead);
  const allList = notifications;

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const popoverOpen = Boolean(anchorEl);

  const NotificationList = ({ items }) => (
    items.length === 0 ? (
      <Box sx={{
        py: 5, px: 3, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1
      }}>
        <NotificationsNoneIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.3)' }} />
        <Typography variant="body2" sx={{ color: 'rgb(0, 0, 0)' }}>
          No notifications yet
        </Typography>
      </Box>
    ) : (
      <List disablePadding>
        {items.map((notif, index) => (
          <Box key={notif._id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => !notif.isRead && handleMarkOneRead(notif._id)}
              sx={{
                cursor: notif.isRead ? 'default' : 'pointer',
                px: 2, py: 1.5,
                background: notif.isRead
                  ? 'transparent'
                  : 'rgba(100, 181, 246, 0.08)',
                borderLeft: notif.isRead
                  ? '3px solid transparent'
                  : '3px solid #000000',
                transition: 'background 0.2s',
                '&:hover': {
                  background: notif.isRead
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(100, 181, 246, 0.12)'
                }
              }}
            >
              {/* Unread dot */}
              {!notif.isRead && (
                <CircleIcon
                  sx={{
                    fontSize: 8,
                    color: '#ff0000',
                    mt: 0.8,
                    mr: 1,
                    flexShrink: 0
                  }}
                />
              )}

              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: notif.isRead
                        ? 'rgb(129, 129, 129)'
                        : '#2c2c2c',
                      fontWeight: notif.isRead ? 400 : 600,
                      fontSize: '0.82rem',
                      lineHeight: 1.4
                    }}
                  >
                    {notif.message}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(27, 27, 27, 0.48)',
                      fontSize: '0.72rem',
                      mt: 0.3,
                      display: 'block'
                    }}
                  >
                    {formatTime(notif.createdAt)}
                    {!notif.isRead && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          ml: 1,
                          color: '#ff0000',
                          fontSize: '0.68rem'
                        }}
                      >
                        • Click to mark as read
                      </Typography>
                    )}
                  </Typography>
                }
                sx={{ ml: notif.isRead ? 2.5 : 0 }}
              />
            </ListItem>
            {index < items.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
            )}
          </Box>
        ))}
      </List>
    )
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          backgroundImage: 'none',
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          {/* Logo */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              flexGrow: 1, cursor: 'pointer', userSelect: 'none',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <MenuBookIcon sx={{ fontSize: 28, color: '#ff8800' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700, fontSize: '1.3rem', color: '#fff',
                textShadow: '0 2px 10px rgba(255,255,255,0.3)',
              }}
            >
              Nalanda Bookstore
            </Typography>
          </Box>

          {/* Nav buttons + Bell */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

            {/* Welcome page */}
            {location.pathname === '/' && (
              <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
                Login
              </Button>
            )}

            {/* Login page */}
            {location.pathname === '/login' && (
              <Button color="inherit" component={Link} to="/signup" sx={navButtonStyle}>
                Signup
              </Button>
            )}

            {/* Signup page */}
            {location.pathname === '/signup' && (
              <Button color="inherit" component={Link} to="/login" sx={navButtonStyle}>
                Login
              </Button>
            )}

            {/* Bell icon — only for logged in regular users, shown before route buttons */}
            {isUserPage && (
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleBellClick}
                  sx={{
                    ml: 0.5,
                    color: '#ffffff',
                    transition: 'all 0.2s',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Badge
                    badgeContent={unreadCount}
                    max={99}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ff4444',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        minWidth: 18,
                        height: 18,
                        border: '2px solid rgba(15, 37, 64, 0.9)'
                      }
                    }}
                  >
                    {unreadCount > 0
                      ? <NotificationsIcon sx={{ fontSize: 22 }} />
                      : <NotificationsNoneIcon sx={{ fontSize: 22 }} />
                    }
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {/* User home */}
            {location.pathname === '/home' && (
              <>
                <Button color="inherit" component={Link} to="/profile" sx={navButtonStyle}>
                  My Profile
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

            {/* Book details */}
            {location.pathname.startsWith('/book/') && (
              <>
                <Button color="inherit" component={Link} to="/home" sx={navButtonStyle}>
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/profile" sx={navButtonStyle}>
                  My Profile
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

            {/* User profile */}
            {location.pathname === '/profile' && (
              <>
                <Button color="inherit" component={Link} to="/home" sx={navButtonStyle}>
                  Home
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin dashboard */}
            {location.pathname === '/admin/dashboard' && (
              <>
                <Button color="inherit" component={Link} to="/admin/users" sx={navButtonStyle}>
                  Manage Users
                </Button>
                <Button color="inherit" component={Link} to="/admin/addbook" sx={navButtonStyle}>
                  Add Book
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin users */}
            {location.pathname === '/admin/users' && (
              <>
                <Button color="inherit" component={Link} to="/admin/dashboard" sx={navButtonStyle}>
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/admin/addbook" sx={navButtonStyle}>
                  Add Book
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

            {/* Admin addbook */}
            {location.pathname === '/admin/addbook' && (
              <>
                <Button color="inherit" component={Link} to="/admin/dashboard" sx={navButtonStyle}>
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/admin/users" sx={navButtonStyle}>
                  Manage Users
                </Button>
                <Button color="inherit" onClick={() => setLogoutDialogOpen(true)} sx={navButtonStyle}>
                  Logout
                </Button>
              </>
            )}

          </Box>
        </Toolbar>
      </AppBar>

      {/* Notification Popover */}
      <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 360,
            maxHeight: 480,
            mt: 1,
            borderRadius: '16px',
            background: 'rgba(15, 37, 64, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {/* Popover Header */}
        <Box sx={{
          px: 2.5, pt: 2, pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: '#ff0000', fontSize: '0.95rem', WebkitTextStroke: '0.075px black' }}
          >
            Notifications
          </Typography>

          {/* Mark all read button — only if there are unread */}
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton
                size="small"
                onClick={handleMarkAllRead}
                sx={{
                  color: '#00ddff',
                  '&:hover': { background: 'rgba(100, 180, 246, 0.42)' }
                }}
              >
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Tabs */}
        <Tabs
          value={notifTab}
          onChange={(e, v) => setNotifTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTab-root': {
              minHeight: 40,
              color: 'rgb(164, 164, 164)',
              fontSize: '0.78rem',
              textTransform: 'none',
              fontWeight: 500,
            },
            '& .Mui-selected': { color: '#64b5f6 !important', fontWeight: 700 },
            '& .MuiTabs-indicator': { backgroundColor: '#64b5f6', height: 2 }
          }}
        >
          <Tab label={`Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
          <Tab label={`All ${allList.length > 0 ? `(${allList.length})` : ''}`} />
        </Tabs>

        {/* Notification list — scrollable */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {notifTab === 0
            ? <NotificationList items={unreadList} />
            : <NotificationList items={allList} />
          }
        </Box>

      </Popover>
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0f2236',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            px: 1,
            minWidth: 320,
          }
        }}
      >
        <DialogTitle sx={{ color: '#000000', fontFamily: "'Playfair Display', serif", fontWeight: 700, pt: 3 }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#000000', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2.5, px: 3, gap: 1 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            sx={{
              color: '#000000',
              border: '1px solid rgb(10, 152, 234)',
              bgcolor: 'rgba(181, 186, 186, 0.9)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              '&:hover': { bgcolor: 'rgb(79, 79, 79)', borderColor: 'rgba(255,255,255,0.4)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              color: '#ffffff',
              bgcolor: '#c0392b',
              boxShadow: '0 4px 14px rgba(192,57,43,0.4)',
              '&:hover': { bgcolor: '#a93226', boxShadow: '0 6px 18px rgba(192,57,43,0.5)' },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;