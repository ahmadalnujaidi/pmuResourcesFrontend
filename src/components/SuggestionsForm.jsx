import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuggestionsForm = () => {
  const [formData, setFormData] = useState({
    suggestion: '',
    description: ''
  });
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const suggestionExamples = [
    'Add a new major...',
    'Add a new course to a major...',
    'Add a new professor teaching a course...',
    'Update course materials...',
    'Report incorrect information...'
  ];

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({
          open: true,
          message: 'Suggestion submitted successfully!',
          severity: 'success'
        });
        setFormData({ suggestion: '', description: '' });
      } else {
        setToast({
          open: true,
          message: 'Failed to submit suggestion',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setToast({
        open: true,
        message: 'Error submitting suggestion',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submit a Suggestion
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Help us improve PMU Resources by submitting your suggestions. Here are some examples of what you can suggest:
        </Typography>

        <List sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          {suggestionExamples.map((example, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={example}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Suggestion Title"
            value={formData.suggestion}
            onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
            required
            margin="normal"
            placeholder="Enter your suggestion title..."
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            multiline
            rows={4}
            margin="normal"
            placeholder="Please provide all the details of your request... For new additions, include all relevant information such as major name, course code, professor name, etc."
            helperText="The more details you provide, the better we can help implement your suggestion."
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ minWidth: 120 }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ minWidth: 120 }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SuggestionsForm;
