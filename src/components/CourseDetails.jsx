import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/courses/${courseId}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setCourseData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleProfessorClick = (professor) => {
    if (courseData && courseData.majors && courseData.majors.length > 0) {
      const majorTitle = courseData.majors[0].title;
      navigate(`/${encodeURIComponent(majorTitle)}/${encodeURIComponent(courseData.courseName)}/${encodeURIComponent(professor.professorName)}`, {
        state: {
          professorId: professor.id,
          courseId: courseId
        }
      });
      console.log(`Course ID: ${courseId}, Professor ID: ${professor.id}`);
      console.log(`Navigating to: /${majorTitle}/${courseData.courseName}/${professor.professorName}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}. Make sure the API server is running.
        </Alert>
      </Box>
    );
  }

  if (!courseData) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">No course data found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ mr: 2 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', textDecoration: 'none' }}
          >
            Home
          </Link>
          <Typography color="text.primary">{courseData.courseName}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Course Information */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {courseData.courseName}
        </Typography>

        {/* Professors List */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Professors
        </Typography>
        <List>
          {courseData.professors.map((professor) => (
            <ListItemButton 
              key={professor.id}
              onClick={() => handleProfessorClick(professor)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateX(4px)',
                  transition: 'transform 0.2s'
                }
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary={professor.professorName}
                secondary="Click to view materials"
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CourseDetails;
