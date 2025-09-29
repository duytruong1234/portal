import { Link, useLocation } from 'react-router-dom'
import { FaLeaf, FaSearch, FaList, FaPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaLeaf className="text-primary-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">Plant Portal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <span>Trang chủ</span>
            </Link>

            <Link
              to="/search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/search') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <FaSearch className="text-sm" />
              <span>Tìm kiếm</span>
            </Link>

            <Link
              to="/plants"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/plants') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              <FaList className="text-sm" />
              <span>Danh sách</span>
            </Link>

            {/* Bookmarks Link - chỉ hiện khi đăng nhập và không phải admin */}
            {user && !isAdmin() && (
              <Link
                to="/bookmarks"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/bookmarks') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <span>❤️ Yêu thích</span>
              </Link>
            )}

            {/* Admin Links */}
            {isAdmin() && (
              <Link
                to="/add-plant"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/add-plant') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <FaPlus className="text-sm" />
                <span>Thêm mới</span>
              </Link>
            )}

            {/* Auth Links */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Xin chào, <span className="font-medium text-primary-600">{user.username}</span>
                    {isAdmin() && <span className="ml-1 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">Admin</span>}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                      isActive('/login') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-primary-600 border border-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <FaSignInAlt className="text-sm" />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link
                    to="/register"
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                      isActive('/register') 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <span>Đăng ký</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar