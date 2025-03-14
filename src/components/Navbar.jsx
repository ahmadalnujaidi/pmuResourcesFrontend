import { useState, useContext } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  useTheme, 
  Button, 
  Avatar, 
  useMediaQuery, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Container
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Login as LoginIcon, 
  Logout as LogoutIcon, 
  Person as PersonIcon, 
  Menu as MenuIcon,
  Lightbulb as LightbulbIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if screen is mobile size
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleOpenAuthModal = () => {
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };
  
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  // Mobile menu drawer content
  const mobileMenuContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2,
        bgcolor: theme.palette.primary.main,
        color: 'white'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          PMU Resources
        </Typography>
        <IconButton 
          color="inherit" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => handleNavigate('/suggestions')}>
          <ListItemIcon>
            <LightbulbIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Suggestions" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {isAuthenticated() ? (
          <>
            <ListItem>
              <ListItemIcon>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: theme.palette.primary.main
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={currentUser?.email?.split('@')[0]} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleOpenAuthModal}>
            <ListItemIcon>
              <LoginIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static" sx={{ 
        boxShadow: `0 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Title on the left */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                flexGrow: { xs: 1, sm: 0 }
              }}
              onClick={() => navigate('/')}
            >
              PMU Resources
            </Typography>
            
            {/* Mobile menu icon */}
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                {/* Desktop navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/suggestions')}
                    sx={{ 
                      mr: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(144, 202, 249, 0.08)'
                      }
                    }}
                  >
                    Suggestions
                  </Button>
                
                  <IconButton 
                    color="inherit" 
                    aria-label="home"
                    onClick={() => navigate('/')}
                    sx={{ 
                      mr: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(144, 202, 249, 0.08)'
                      }
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                  
                  {isAuthenticated() ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            mr: 1
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {currentUser?.email?.split('@')[0]}
                        </Typography>
                      </Box>
                      <IconButton 
                        color="inherit" 
                        aria-label="logout"
                        onClick={handleLogout}
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'rgba(144, 202, 249, 0.08)'
                          }
                        }}
                      >
                        <LogoutIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Button 
                      startIcon={<LoginIcon />}
                      color="inherit"
                      onClick={handleOpenAuthModal}
                      sx={{ 
                        '&:hover': {
                          backgroundColor: 'rgba(144, 202, 249, 0.08)'
                        }
                      }}
                    >
                      Login
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile menu drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {mobileMenuContent}
      </Drawer>
      
      <AuthModal 
        open={authModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </>
  );
};

export default Navbar;
