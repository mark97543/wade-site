import {Routes, Route} from "react-router-dom"
import { Header } from "@wade/ui"
import { ProtectedRoute } from '@wade/auth';
import {TopPage} from "./pages/1_TopPage.jsx";




function App() {

  const pending = import.meta.env.VITE_PENDING_USER
  const basic = import.meta.env.VITE_BASIC_USER
  const admin = import.meta.env.VITE_ADMIN_USER

  return (
    <>
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={<ProtectedRoute allowedRoles={[basic, admin]}>
            <TopPage />
          </ProtectedRoute>} 
        />
      </Routes>
    </>
  )
}

export default App