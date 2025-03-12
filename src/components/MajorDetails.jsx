import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  CardActionArea
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Book as BookIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import mockApiService from '../services/mockApi';

const MajorDetails = () => {
  const { majorTitle } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let data;
        
        try {
          // Try to fetch from the real API first
          const response = await fetch(`http://localhost:3002/api/${encodeURIComponent(majorTitle)}/courses`);
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          data = await response.json();
          setUsingMockData(false);
        } catch (apiError) {
          console.warn('Could not fetch from real API, using mock data instead:', apiError);
          // Fallback to mock data
          data = await mockApiService.fetchCourses(majorTitle);
          setUsingMockData(true);
        }
        
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching courses for ${majorTitle}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [majorTitle]);

  const handleCourseClick = (course) => {
    navigate(`/course/${course.id}`);
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
          {error}. Make sure the API server is running at http://localhost:3002.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={() => navigate('/')} 
          sx={{ mr: 2 }}
          aria-label="back to home"
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
          <Typography color="text.primary">{majorTitle}</Typography>
        </Breadcrumbs>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {majorTitle} Courses
      </Typography>
      
      {usingMockData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using mock data. Connect to the real API at http://localhost:3002 for live data.
        </Alert>
      )}

      {courses.length === 0 ? (
        <Alert severity="info">
          No courses found for this major.
        </Alert>
      ) : (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} lg={4} key={`${course.code}-${index}`}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={() => handleCourseClick(course)}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {course.code}
                        </Typography>
                        {course.credits && (
                          <Chip 
                            label={`${course.credits} CR`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Typography variant="subtitle1" gutterBottom>
                        {course.courseName || course.title}
                      </Typography>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      {course.instructor && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>
                      )}
                      
                      {course.schedule && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.schedule}
                          </Typography>
                        </Box>
                      )}
                      
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Prerequisites:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {course.prerequisites.map((prereq, i) => (
                              <Chip 
                                key={i} 
                                label={prereq} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default MajorDetails;
