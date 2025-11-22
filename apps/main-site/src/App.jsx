import { Routes, Route } from 'react-router-dom';
import { Header } from "@wade/ui"
import { Home } from "./pages/Home"
import { Login_Page } from './pages/Login_Page';
import {Register} from './pages/Register';
import { Pending } from './pages/Pending';
import { ProtectedRoute } from '@wade/auth';
import { Landing } from './pages/Landing';
import { Unauth } from './pages/Unautherized';

function App() {

  const pending = import.meta.env.VITE_PENDING_USER
  const basic = import.meta.env.VITE_BASIC_USER
  const admin = import.meta.env.VITE_ADMIN_USER



  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login_Page />} />
        <Route path="/register" element={<Register />} />
        <Route path='/unauthorized' element={<Unauth />} />
        
        <Route 
          path="/pending" 
          element={<ProtectedRoute allowedRoles={[pending]}>
            <Pending />
          </ProtectedRoute>} 
        />

        <Route
          path='/landing'
          element={<ProtectedRoute allowedRoles={[admin, basic]}>
            <Landing />
          </ProtectedRoute>}
        />

      

      </Routes>
    </>
  )
}

export default App