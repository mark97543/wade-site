import { Routes, Route } from 'react-router-dom';
import { Header } from "@wade/ui"
import { Home } from "./pages/Home"
import { Login_Page } from './pages/Login_Page';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login_Page />} />
      </Routes>
    </>
  )
}

export default App