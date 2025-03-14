import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Tooltip,
  Snackbar,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Stack,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Radio,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  OpenInNew as OpenInNewIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  PlaylistAdd as PlaylistAddIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { AuthContext } from "../contexts/AuthContext";
import UploadMaterialModal from "./UploadMaterialModal";
import AuthModal from "./AuthModal";

const materialTypes = [
  { value: "notes", label: "Lecture Notes", icon: <DescriptionIcon /> },
  { value: "assignments", label: "Assignments", icon: <AssignmentIcon /> },
  { value: "olds", label: "Old Exams", icon: <BookIcon /> },
];

const ProfessorMaterials = () => {
  const { majorTitle, courseName, professorName, type = "olds" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedType, setSelectedType] = useState(type || "olds");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Extract professorId and courseId from location state if available
  const professorId = location.state?.professorId;
  const courseId = location.state?.courseId;

  // Add to Playlist related states
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistDialogOpen, setNewPlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setMaterials([]);
        const apiUrl = `${API_URL}/${encodeURIComponent(
          majorTitle
        )}/${encodeURIComponent(courseName)}/${encodeURIComponent(
          professorName
        )}/${selectedType}`;
  

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        

        // Ensure we're handling both array and single object responses
        const materialsArray = Array.isArray(data) ? data : [data];
       

        setMaterials(materialsArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError(err.message);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [majorTitle, courseName, professorName, selectedType]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    navigate(
      `/${encodeURIComponent(majorTitle)}/${encodeURIComponent(
        courseName
      )}/${encodeURIComponent(professorName)}/${newType}`
    );
  };

  const getIcon = (materialType) => {
    const typeObject = materialTypes.find(
      (type) => type.value === materialType
    );
    return typeObject ? typeObject.icon : <DescriptionIcon />;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openMaterial = (url) => {
    setSelectedPdfUrl(url);
    setPdfViewerOpen(true);
  };

  const handleClosePdfViewer = () => {
    setPdfViewerOpen(false);
    setSelectedPdfUrl("");
  };

  const extractFileName = (url) => {
    try {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      // Remove timestamp prefix if present (e.g., "1741735085446-lab_04_Pointers.pdf" → "lab_04_Pointers.pdf")
      return fileName
        .replace(/^\d+-/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ");
    } catch (e) {
      return "Material";
    }
  };

  const handleUploadClick = () => {
    if (!isAuthenticated()) {
      setToast({
        open: true,
        message: "Please sign in to upload materials",
        severity: "warning"
      });
      setAuthModalOpen(true);
      return;
    }
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleUploadSuccess = () => {
    setToast({
      open: true,
      message: "Your uploaded material is under revision. Once approved, it will be available on the website.",
      severity: "info"
    });
    
    // Refresh materials list after successful upload
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setMaterials([]);
        const apiUrl = `${API_URL}/${encodeURIComponent(
          majorTitle
        )}/${encodeURIComponent(courseName)}/${encodeURIComponent(
          professorName
        )}/${selectedType}`;
      

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
       

        // Ensure we're handling both array and single object responses
        const materialsArray = Array.isArray(data) ? data : [data];
        

        setMaterials(materialsArray);
        setError(null);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError(err.message);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  };

  const getFilteredMaterials = () => {
    if (!searchQuery) return materials;
    return materials.filter(material => 
      (material.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredMaterials = getFilteredMaterials();

  // Add to Playlist related functions
  const handleAddToPlaylist = (material) => {
    if (!isAuthenticated()) {
      setToast({
        open: true,
        message: "Please sign in to add to playlist",
        severity: "warning"
      });
      setAuthModalOpen(true);
      return;
    }
    
    setSelectedMaterial(material);
    fetchUserPlaylists();
    setPlaylistDialogOpen(true);
  };

  const fetchUserPlaylists = async () => {
    if (!currentUser?.token) return;
    
    try {
      setLoadingPlaylists(true);
      const response = await fetch(`${API_URL}/playlists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
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
      setToast({
        open: true,
        message: "Failed to load playlists",
        severity: "error"
      });
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleClosePlaylistDialog = () => {
    setPlaylistDialogOpen(false);
    setSelectedPlaylistId("");
    setSelectedMaterial(null);
  };

  const handleOpenNewPlaylistDialog = () => {
    setNewPlaylistName("");
    setNewPlaylistDialogOpen(true);
  };

  const handleCloseNewPlaylistDialog = () => {
    setNewPlaylistDialogOpen(false);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      setCreatingPlaylist(true);
      
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
      
      const newPlaylist = await response.json();
      
      // Add the new playlist to the list and select it
      setPlaylists(prev => [...prev, newPlaylist]);
      setSelectedPlaylistId(newPlaylist.id);
      
      // Close the create playlist dialog
      setNewPlaylistDialogOpen(false);
      
      setToast({
        open: true,
        message: `Playlist "${newPlaylistName}" created`,
        severity: "success"
      });
      
    } catch (err) {
      console.error('Error creating playlist:', err);
      setToast({
        open: true,
        message: "Failed to create playlist",
        severity: "error"
      });
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const handleAddMaterialToPlaylist = async () => {
    if (!selectedPlaylistId || !selectedMaterial) return;
    
    try {
      setAddingToPlaylist(true);
      
      // Prepare data to send to API
      const materialData = {
        title: selectedMaterial.title || extractFileName(selectedMaterial.data),
        type: selectedMaterial.type,
        data: selectedMaterial.data
      };
      
      const response = await fetch(`${API_URL}/playlists/${selectedPlaylistId}/materials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(materialData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to playlist');
      }
      
      setToast({
        open: true,
        message: "Material added to playlist successfully",
        severity: "success"
      });
      
      // Close dialog
      handleClosePlaylistDialog();
      
    } catch (err) {
      console.error('Error adding to playlist:', err);
      setToast({
        open: true,
        message: "Failed to add material to playlist",
        severity: "error"
      });
    } finally {
      setAddingToPlaylist(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Navigation */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", sm: "center" }, 
          mb: 3,
          gap: 2
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
            aria-label="go back to home"
          >
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs 
            aria-label="breadcrumb"
            sx={{ 
              flexWrap: "wrap",
              "& .MuiBreadcrumbs-ol": {
                flexWrap: "wrap"
              }
            }}
          >
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate("/")}
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
            >
              Home
            </Link>
            <Typography color="text.primary">{majorTitle}</Typography>
            <Typography color="text.primary">{courseName}</Typography>
            <Typography color="text.primary">{professorName}</Typography>
          </Breadcrumbs>
        </Box>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
            <InputLabel id="material-type-label">Material Type</InputLabel>
            <Select
              labelId="material-type-label"
              value={selectedType}
              label="Material Type"
              onChange={handleTypeChange}
              fullWidth
            >
              {materialTypes.map((materialType) => (
                <MenuItem key={materialType.value} value={materialType.value}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {materialType.icon}
                    <Typography sx={{ ml: 1 }}>{materialType.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FavoriteIcon />}
              onClick={() => window.open("https://tip.dokan.sa/pmuer", "_blank")}
              fullWidth
              sx={{ whiteSpace: "nowrap" }}
            >
              Donate
            </Button>
            <Tooltip
              title={
                isAuthenticated() ? "Upload new material" : "Login to upload"
              }
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                fullWidth
              >
                Upload
              </Button>
            </Tooltip>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by material title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading materials: {error}
        </Alert>
      )}

      {/* Materials Display */}
      {!loading && materials && materials.length > 0 ? (
        <Grid container spacing={2}>
          {filteredMaterials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ mr: 1, pt: 0.5 }}>
                      {getIcon(material.type)}
                    </Box>
                    <Box sx={{ width: "calc(100% - 32px)" }}>
                      <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
                        {material.title || extractFileName(material.data)}
                      </Typography>
                      {material.title && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", wordBreak: "break-word" }}
                        >
                          {extractFileName(material.data)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 1
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Type: {material.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(material.createdAt)}
                    </Typography>
                  </Box>

                  <Stack direction="column" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => openMaterial(material.data)}
                      fullWidth
                    >
                      Open Material
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                        onClick={() => window.open(material.data, "_blank")}
                        sx={{ flexGrow: 1 }}
                      >
                        DOWNLOAD
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAddToPlaylist(material)}
                        sx={{ minWidth: 'auto' }}
                      >
                        <PlaylistAddIcon />
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ mt: 3, p: 3, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              No {selectedType} found for {professorName}, check back later...
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      )}
      {/* PDF Viewer Dialog */}
      <Dialog
        open={pdfViewerOpen}
        onClose={handleClosePdfViewer}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: "90vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">View Material</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClosePdfViewer}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '100%' }}>
          <iframe
            src={selectedPdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title="PDF Viewer"
          />
        </DialogContent>
      </Dialog>

      {/* Upload Material Modal */}
      <UploadMaterialModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        professorId={professorId}
        courseId={courseId}
        onUploadSuccess={handleUploadSuccess}
      />

      <AuthModal 
        open={authModalOpen}
        onClose={handleCloseAuthModal}
      />

      {/* Add to Playlist Dialog */}
      <Dialog
        open={playlistDialogOpen}
        onClose={handleClosePlaylistDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: isMobile ? '50vh' : 'auto',
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">Add to Playlist</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePlaylistDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingPlaylists ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : playlists.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You don't have any playlists yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenNewPlaylistDialog}
                startIcon={<AddIcon />}
              >
                Create New Playlist
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Select a playlist:
              </Typography>
              <List
                sx={{
                  maxHeight: '40vh',
                  overflow: 'auto',
                  mb: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {playlists.map((playlist) => (
                  <ListItem
                    key={playlist.id}
                    disablePadding
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <ListItemButton
                      selected={selectedPlaylistId === playlist.id}
                      onClick={() => setSelectedPlaylistId(playlist.id)}
                      sx={{ 
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Radio
                          checked={selectedPlaylistId === playlist.id}
                          edge="start"
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={playlist.name}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenNewPlaylistDialog}
                startIcon={<AddIcon />}
                fullWidth
              >
                Create New Playlist
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClosePlaylistDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedPlaylistId || addingToPlaylist}
            onClick={handleAddMaterialToPlaylist}
          >
            {addingToPlaylist ? <CircularProgress size={24} /> : "Add to Playlist"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Playlist Dialog */}
      <Dialog
        open={newPlaylistDialogOpen}
        onClose={handleCloseNewPlaylistDialog}
        maxWidth="sm"
        fullWidth={isMobile}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : '400px',
          },
        }}
      >
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="playlist-name"
            label="Playlist Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseNewPlaylistDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!newPlaylistName.trim() || creatingPlaylist}
            onClick={handleCreatePlaylist}
          >
            {creatingPlaylist ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default ProfessorMaterials;
