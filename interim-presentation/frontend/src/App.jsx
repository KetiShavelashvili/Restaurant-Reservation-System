import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ReservationPage from './pages/ReservationPage'
import AdminPage from './pages/AdminPage'
import ReservationsList from './pages/ReservationsList'
import './App.css'

function App() {
  return (
    <ReservationProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/reserve" element={<ReservationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/reservations" element={<ReservationsList />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ReservationProvider>
  )
}

export default App