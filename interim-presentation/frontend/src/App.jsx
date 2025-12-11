import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import ReservationPage from './pages/ReservationPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ReservationsList from './pages/ReservationsList.jsx'
import Login from './pages/Login.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                
                <Route
                  path="/reserve"
                  element={
                    <ProtectedRoute>
                      <ReservationPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/reservations"
                  element={
                    <ProtectedRoute>
                      <ReservationsList />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ReservationProvider>
    </AuthProvider>
  )
}

export default App