import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookmarksApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/userUtils'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FaHeart, FaExclamationCircle } from 'react-icons/fa'

const Bookmarks = () => {
  const { user, isAuthenticated } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isUserAdmin = isAdmin(user)

  useEffect(() => {
    if (isAuthenticated() && !isUserAdmin) {
      fetchBookmarks()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, isUserAdmin])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await bookmarksApi.getAll()
      if (response.data.success) {
        setBookmarks(response.data.data)
      } else {
        setError('Không thể tải danh sách yêu thích')
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err)
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách yêu thích')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <FaExclamationCircle className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Yêu cầu đăng nhập</h2>
            <p className="text-yellow-700 mb-4">Vui lòng đăng nhập để xem danh sách yêu thích</p>
            <Link
              to="/login"
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isUserAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <FaExclamationCircle className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Không có quyền truy cập</h2>
            <p className="text-yellow-700 mb-4">Admin không thể sử dụng tính năng yêu thích</p>
            <Link
              to="/plants"
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Xem danh sách thực vật
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <FaHeart className="text-3xl text-red-500 mr-3" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Danh sách yêu thích
            </h1>
            <p className="text-gray-600 mt-1">
              Các thực vật bạn đã đánh dấu yêu thích
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Đang tải danh sách yêu thích..." />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Lỗi tải dữ liệu</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchBookmarks}
                  className="text-red-600 hover:text-red-700 underline mt-2"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookmarks Grid */}
        {!loading && !error && (
          <div className="fade-in">
            {bookmarks.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Bạn có {bookmarks.length} thực vật yêu thích
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bookmarks.map((bookmark) => (
                    <PlantCard
                      key={bookmark._id}
                      plant={bookmark.plant}
                      showBookmark={true}
                      isBookmarked={true}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FaHeart className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chưa có thực vật yêu thích
                </h3>
                <p className="text-gray-600 mb-6">
                  Khám phá và thêm các thực vật vào danh sách yêu thích của bạn
                </p>
                <Link
                  to="/plants"
                  className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Khám phá thực vật
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookmarks