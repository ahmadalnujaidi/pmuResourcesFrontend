import { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AuthContext } from "../contexts/AuthContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const materialTypes = [
  { value: "notes", label: "Lecture Notes" },
  { value: "assignments", label: "Assignments" },
  { value: "olds", label: "Old Exams" },
];

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadMaterialModal = ({
  open,
  onClose,
  professorId,
  courseId,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [materialType, setMaterialType] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [titleError, setTitleError] = useState("");

  const { currentUser } = useContext(AuthContext);

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setMaterialType("");
      setTitle("");
      setErrorMessage("");
      setFileError("");
      setTypeError("");
      setTitleError("");
      onClose();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleTypeChange = (event) => {
    setMaterialType(event.target.value);
    setTypeError("");
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setTitleError("");
  };

  const validateForm = () => {
    let isValid = true;

    if (!file) {
      setFileError("Please select a file to upload");
      isValid = false;
    }

    if (!materialType) {
      setTypeError("Please select a material type");
      isValid = false;
    }

    if (!title.trim()) {
      setTitleError("Please enter a title for the material");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    if (!currentUser || !currentUser.token) {
      setErrorMessage("You must be logged in to upload materials");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", materialType);
      formData.append("professor_id", professorId);
      formData.append("course_id", courseId);
      formData.append("title", title.trim());

      const response = await fetch("http://localhost:3002/api/approvals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload material");
      }

      await response.json();

      // Notify parent component of successful upload
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Close modal immediately
      handleClose();

    } catch (error) {
      setErrorMessage(error.message || "Failed to upload material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-material-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography
          id="upload-material-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Upload Material
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Material Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={handleTitleChange}
            error={!!titleError}
            helperText={titleError}
            disabled={loading}
            required
          />

          <FormControl fullWidth error={!!typeError} margin="normal">
            <InputLabel id="material-type-label">Material Type</InputLabel>
            <Select
              labelId="material-type-label"
              id="material-type"
              value={materialType}
              label="Material Type"
              onChange={handleTypeChange}
              disabled={loading}
              required
            >
              {materialTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {typeError && <FormHelperText>{typeError}</FormHelperText>}
          </FormControl>

          <Box sx={{ mt: 2, mb: 1 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ width: "100%", py: 1.5 }}
              disabled={loading}
            >
              {file ? file.name : "Choose File"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </Button>
            {fileError && (
              <FormHelperText error>
                {fileError}
              </FormHelperText>
            )}
            {file && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: "block", 
                  mt: 0.5,
                  textAlign: "right"
                }}
              >
                Size: {formatFileSize(file.size)}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadMaterialModal;
