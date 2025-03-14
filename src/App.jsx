import { Container } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import ThemeProvider from './theme/ThemeProvider'
import AuthProvider from './contexts/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import MajorDetails from './components/MajorDetails'
import CourseDetails from './components/CourseDetails'
import ProfessorMaterials from './components/ProfessorMaterials'
import SuggestionsForm from './components/SuggestionsForm'
import Playlists from './components/Playlists'
import PlaylistDetails from './components/PlaylistDetails'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app-container">
          <Navbar />
          
          {/* Main content */}
          <Container className="content-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/major/:majorTitle" element={<MajorDetails />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              <Route path="/:majorTitle/:courseName/:professorName/:type" element={<ProfessorMaterials />} />
              <Route path="/:majorTitle/:courseName/:professorName" element={<ProfessorMaterials />} />
              <Route path="/suggestions" element={<SuggestionsForm />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
            </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
