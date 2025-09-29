import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import PlantDetail from './pages/PlantDetail'
import PlantList from './pages/PlantList'
import AddPlant from './pages/AddPlant'
import EditPlant from './pages/EditPlant'
import Login from './pages/Login'
import Register from './pages/Register'
import Bookmarks from './pages/Bookmarks'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ToastNotification'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/plant/:id" element={<PlantDetail />} />
              <Route path="/plants" element={<PlantList />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/add-plant" element={<AddPlant />} />
              <Route path="/edit-plant/:id" element={<EditPlant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App