import { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Divider, 
  List, 
  Card, 
  CardContent, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Grid,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openNewPlaylistDialog, setOpenNewPlaylistDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const API_URL = import.meta.env.VITE_API_URL;
  
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      
      const data = await response.json();
      setPlaylists(data);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError(err.message || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (currentUser?.token) {
      fetchPlaylists();
    } else {
      setLoading(false);
      setError('You must be logged in to view playlists');
    }
  }, [currentUser]);
  
  const handleOpenNewPlaylistDialog = () => {
    setNewPlaylistName('');
    setOpenNewPlaylistDialog(true);
  };
  
  const handleCloseNewPlaylistDialog = () => {
    setOpenNewPlaylistDialog(false);
  };
  
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      setCreating(true);
      
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPlaylistName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      
      await fetchPlaylists();
      handleCloseNewPlaylistDialog();
    } catch (err) {
      console.error('Error creating playlist:', err);
      setError(err.message || 'Failed to create playlist');
    } finally {
      setCreating(false);
    }
  };

  const openDeleteConfirmation = (playlist) => {
    setPlaylistToDelete(playlist);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteDialogOpen(false);
    setPlaylistToDelete(null);
  };

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return;
    
    try {
      setDeleting(true);
      
      const response = await fetch(`${API_URL}/playlists/${playlistToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      
      // Remove playlist from local state
      setPlaylists(prevPlaylists => 
        prevPlaylists.filter(playlist => playlist.id !== playlistToDelete.id)
      );
      
      closeDeleteConfirmation();
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError(err.message || 'Failed to delete playlist');
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3 
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom={isMobile} 
          sx={{ fontWeight: 'bold' }}
        >
          My Playlists
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewPlaylistDialog}
          fullWidth={isMobile}
          sx={{ mt: isMobile ? 1 : 0 }}
        >
          Create Playlist
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {playlists.length === 0 ? (
        <Paper sx={{ p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            You don't have any playlists yet. Create your first playlist to get started!
          </Typography>
        </Paper>
      ) : (
        <List sx={{ 
          p: 0,
          maxHeight: isMobile ? 'calc(100vh - 220px)' : 'none',
          overflow: isMobile ? 'auto' : 'visible' 
        }}>
          {playlists.map((playlist) => (
            <Card 
              key={playlist.id} 
              sx={{ 
                mb: 2, 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ 
                p: 0, 
                '&:last-child': { 
                  pb: 0 
                } 
              }}>
                <Grid container>
                  <Grid 
                    item 
                    xs={10} 
                    sx={{ 
                      cursor: 'pointer',
                      p: { xs: 2, sm: 3 }
                    }}
                    onClick={() => navigate(`/playlists/${playlist.id}`)}
                  >
                    <Typography 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}
                    >
                      {playlist.name}
                    </Typography>
                  </Grid>
                  <Grid 
                    item 
                    xs={2} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      borderLeft: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <IconButton 
                      color="error" 
                      onClick={() => openDeleteConfirmation(playlist)}
                      size={isMobile ? "small" : "medium"}
                      aria-label="delete playlist"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Create New Playlist Dialog */}
      <Dialog 
        open={openNewPlaylistDialog} 
        onClose={handleCloseNewPlaylistDialog}
        fullScreen={isMobile}
        PaperProps={{
          sx: { width: isMobile ? '100%' : '400px', maxWidth: '100%' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 } 
        }}>
          <Typography variant="h6">Create New Playlist</Typography>
          {isMobile && (
            <IconButton edge="end" color="inherit" onClick={handleCloseNewPlaylistDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Playlist Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2 } }}>
          <Button 
            onClick={handleCloseNewPlaylistDialog} 
            color="primary"
            fullWidth={isMobile}
            sx={{ mb: isMobile ? 1 : 0 }}
            variant={isMobile ? "outlined" : "text"}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePlaylist} 
            color="primary" 
            variant="contained"
            disabled={!newPlaylistName.trim() || creating}
            fullWidth={isMobile}
          >
            {creating ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Playlist
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{playlistToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePlaylist} 
            color="error" 
            variant="contained" 
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Playlists;
