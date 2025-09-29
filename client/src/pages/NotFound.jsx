import { Link } from 'react-router-dom'
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 404 Icon */}
          <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-4xl text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-600 mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center justify-center w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <FaHome className="mr-2" />
              Về trang chủ
            </Link>
            
            <Link
              to="/search"
              className="flex items-center justify-center w-full bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              <FaSearch className="mr-2" />
              Tìm kiếm thực vật
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Có thể bạn đang tìm:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { to: '/plants', label: 'Danh sách thực vật' },
                { to: '/search', label: 'Tìm kiếm' },
                { to: '/', label: 'Trang chủ' }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Plant Portal Branding */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Plant Portal - Cổng thông tin thực vật
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound