import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CardActionArea
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import mockApiService from '../services/mockApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedMajors, setGroupedMajors] = useState({});
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setLoading(true);
        let data;
        
        try {
          // Try to fetch from the real API first
          const response = await fetch('http://localhost:3002/api/majors');
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          data = await response.json();
          setUsingMockData(false);
        } catch (apiError) {
          console.warn('Could not fetch from real API, using mock data instead:', apiError);
          // Fallback to mock data
          data = await mockApiService.fetchMajors();
          setUsingMockData(true);
        }
        
        setMajors(data);
        
        // Group majors by college
        const grouped = data.reduce((acc, major) => {
          const { college } = major;
          if (!acc[college]) {
            acc[college] = [];
          }
          acc[college].push(major);
          return acc;
        }, {});
        
        setGroupedMajors(grouped);
        setError(null);
      } catch (err) {
        console.error('Error fetching majors:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMajors();
  }, []);

  const handleMajorClick = (majorTitle) => {
    navigate(`/major/${encodeURIComponent(majorTitle)}`);
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
      <Typography variant="h4" component="h1" gutterBottom>
        PMU Majors
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Browse all available majors at Prince Mohammad Bin Fahd University
      </Typography>
      
      {usingMockData && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using mock data. Connect to the real API at http://localhost:3002 for live data.
        </Alert>
      )}

      {Object.entries(groupedMajors).map(([college, collegeMajors]) => (
        <Paper 
          key={college} 
          elevation={3} 
          sx={{ 
            mb: 4, 
            p: 3, 
            bgcolor: 'background.paper',
            borderRadius: 2
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h2">
              {college}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            {collegeMajors.map((major, index) => (
              <Grid item xs={12} sm={6} md={4} key={`${major.title}-${index}`}>
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
                    sx={{ height: '100%' }}
                    onClick={() => handleMajorClick(major.title)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {major.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        College: {major.college}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default HomePage;
