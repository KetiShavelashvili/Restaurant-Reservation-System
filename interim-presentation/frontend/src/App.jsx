import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext.jsx'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import ReservationPage from './pages/ReservationPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import ReservationsList from './pages/ReservationsList.jsx'
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