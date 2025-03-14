import { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Divider, 
  List, 
  ListItem, 
  Card, 
  CardContent, 
  Alert,
  Chip,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery,
  useTheme,
  Stack
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  Home as HomeIcon,
  OpenInNew as OpenInNewIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PlaylistDetails = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { playlistId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch playlist details');
        }
        
        const data = await response.json();
        setPlaylist(data);
      } catch (err) {
        console.error('Error fetching playlist details:', err);
        setError(err.message || 'Failed to load playlist details');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.token && playlistId) {
      fetchPlaylistDetails();
    } else {
      setLoading(false);
      setError('You must be logged in to view playlist details');
    }
  }, [currentUser, playlistId, API_URL]);
  
  const handleOpenMaterialDialog = (material) => {
    setSelectedMaterial(material);
    setOpenMaterialDialog(true);
  };

  const handleCloseMaterialDialog = () => {
    setOpenMaterialDialog(false);
  };
  
  const handleOpenExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const handleGoHome = () => {
    navigate('/');
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeletePlaylist = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch(`${API_URL}/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      
      // Navigate back to playlists page after successful deletion
      navigate('/playlists');
    } catch (err) {
      console.error('Error deleting playlist:', err);
      setError(err.message || 'Failed to delete playlist');
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const renderMaterialContent = (material) => {
    // Determine content type from URL or material.type
    const isImage = /\.(jpeg|jpg|gif|png)$/i.test(material.data);
    const isPDF = /\.pdf$/i.test(material.data);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(material.data);
    const isAudio = /\.(mp3|wav|ogg)$/i.test(material.data);
    
    if (isImage) {
      return <img src={material.data} alt={material.title} style={{ maxWidth: '100%', maxHeight: '70vh' }} />;
    } else if (isPDF) {
      return (
        <iframe 
          src={material.data} 
          width="100%" 
          height={isMobile ? "300px" : "500px"} 
          title={material.title}
          style={{ border: 'none' }}
        />
      );
    } else if (isVideo) {
      return (
        <video controls width="100%" style={{ maxHeight: isMobile ? '50vh' : '70vh' }}>
          <source src={material.data} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (isAudio) {
      return (
        <audio controls style={{ width: '100%' }}>
          <source src={material.data} />
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      // Default fallback
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" gutterBottom>
            This content type cannot be previewed directly.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleOpenExternalLink(material.data)}
            startIcon={<OpenInNewIcon />}
          >
            Open External Link
          </Button>
        </Box>
      );
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
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 2 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: isMobile ? 2 : 0,
          width: isMobile ? '100%' : 'auto' 
        }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
            onClick={() => navigate('/playlists')}
            size={isMobile ? "small" : "medium"}
          >
            Back to Playlists
          </Button>
          <IconButton 
            color="primary" 
            onClick={handleGoHome}
            size={isMobile ? "small" : "medium"}
          >
            <HomeIcon />
          </IconButton>
        </Box>
      </Box>
      
      {error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : playlist ? (
        <>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            mb: 2
          }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              gutterBottom={isMobile}
              sx={{ fontWeight: 'bold' }}
            >
              {playlist.name}
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenDeleteDialog}
              size={isMobile ? "small" : "medium"}
              sx={{ mt: isMobile ? 1 : 0 }}
            >
              Delete Playlist
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Materials
          </Typography>
          
          {playlist.materials && playlist.materials.length > 0 ? (
            <List sx={{ p: 0 }}>
              {playlist.materials.map((material, index) => (
                <Card key={material.id || index} sx={{ mb: 2, borderRadius: 2 }}>
                  <CardContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
                    <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                        >
                          {material.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 1 }}>
                          <Chip 
                            label={material.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ mr: 1, mb: isMobile ? 1 : 0 }}
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                          >
                            Created: {formatDate(material.createdAt)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid 
                        item 
                        xs={12} 
                        sm={4} 
                        sx={{ 
                          mt: isMobile ? 1 : 0,
                          textAlign: { xs: 'left', sm: 'right' },
                          display: 'flex',
                          flexDirection: isMobile ? 'row' : 'column',
                          justifyContent: isMobile ? 'flex-start' : 'flex-end',
                          gap: 1
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenMaterialDialog(material)}
                          fullWidth={isTablet && !isMobile}
                          size={isMobile ? "small" : "medium"}
                        >
                          Open Material
                        </Button>
                        <Button
                          variant="outlined"
                          endIcon={<OpenInNewIcon />}
                          onClick={() => handleOpenExternalLink(material.data)}
                          fullWidth={isTablet && !isMobile}
                          size={isMobile ? "small" : "medium"}
                        >
                          External
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </List>
          ) : (
            <Paper sx={{ p: 3, mt: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="body1" color="text.secondary" align="center">
                This playlist doesn't have any materials yet.
              </Typography>
            </Paper>
          )}
        </>
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Playlist not found.
        </Alert>
      )}

      {/* Material Dialog */}
      <Dialog
        open={openMaterialDialog}
        onClose={handleCloseMaterialDialog}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: isMobile ? '100%' : 'auto',
            maxHeight: isMobile ? '100%' : '90vh'
          }
        }}
      >
        {selectedMaterial && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 }
            }}>
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  maxWidth: { xs: '80%', sm: '90%' }, 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                {selectedMaterial.title}
              </Typography>
              <IconButton edge="end" color="inherit" onClick={handleCloseMaterialDialog} aria-label="close">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={selectedMaterial.type} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" component="span" color="text.secondary">
                  Created: {formatDate(selectedMaterial.createdAt)}
                </Typography>
              </Box>
              
              {renderMaterialContent(selectedMaterial)}
            </DialogContent>
            <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2 } }}>
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                width={isMobile ? "100%" : "auto"}
              >
                <Button 
                  onClick={handleCloseMaterialDialog}
                  variant={isMobile ? "outlined" : "text"}
                  fullWidth={isMobile}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => handleOpenExternalLink(selectedMaterial.data)}
                  startIcon={<OpenInNewIcon />}
                  variant="contained"
                  fullWidth={isMobile}
                >
                  Open External Link
                </Button>
              </Stack>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Playlist Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Playlist
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{playlist?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
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

export default PlaylistDetails;
