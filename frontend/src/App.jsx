import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Login from './pages/Login';
import AdminView from './pages/AdminView';
import DoctorView from './pages/DoctorView';
import PacienteView from './pages/PacienteView';
import Navbar from './components/navBar';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/paciente" element={<ProtectedRoute element={PacienteView} allowedRoles={['paciente']} />} />
        <Route path="/doctor" element={<ProtectedRoute element={DoctorView} allowedRoles={['doctor']} />} />
        <Route path="/admin" element={<ProtectedRoute element={AdminView} allowedRoles={['admin']} />} />
      </Routes>
    </Router>
  );
}

export default App;
