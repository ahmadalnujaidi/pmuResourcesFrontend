import { useState, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Tab,
  Tabs,
  Alert,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const AuthModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register } = useContext(AuthContext);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    // Reset form and messages when switching tabs
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate inputs
    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (activeTab === 0) { // Login
      try {
        setLoading(true);
        await login(email, password);
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to login. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    } else { // Register
      if (!fullName) {
        setErrorMessage('Full name is required');
        return;
      }
      
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        return;
      }
      
      try {
        setLoading(true);
        await register(email, fullName, password);
        setSuccessMessage('Registration successful! You can now login.');
        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab(0);
          setPassword('');
        }, 1500);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to register. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
    >
      <Box sx={modalStyle}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          {activeTab === 1 && (
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              margin="normal"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
          )}

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              activeTab === 0 ? 'Login' : 'Register'
            )}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {activeTab === 0
            ? "Don't have an account? Switch to Register"
            : "Already have an account? Switch to Login"}
        </Typography>
      </Box>
    </Modal>
  );
};

export default AuthModal;
