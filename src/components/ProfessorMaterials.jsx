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
  Stack,
  useMediaQuery,
  useTheme,
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
  const { isAuthenticated } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Extract professorId and courseId from location state if available
  const professorId = location.state?.professorId;
  const courseId = location.state?.courseId;

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
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => window.open(material.data, "_blank")}
                      fullWidth
                    >
                      DOWNLOAD
                    </Button>
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
