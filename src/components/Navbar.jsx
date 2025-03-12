import { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, useTheme, Button, Avatar } from '@mui/material';
import { Home as HomeIcon, Login as LoginIcon, Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const handleOpenAuthModal = () => {
    setAuthModalOpen(true);
  };
  
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <>
      <AppBar position="static" sx={{ 
        boxShadow: `0 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Toolbar>
          {/* Title on the left */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            PMU Resources
          </Typography>
          
          {/* Buttons on the right */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Toolbar>
      </AppBar>
      
      <AuthModal 
        open={authModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </>
  );
};

export default Navbar;
