import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { plantsApi, bookmarksApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { isSameUser, getUserId, isAdmin as checkIsAdmin } from '../utils/userUtils'
import { useToast } from '../components/ToastNotification'
import LoadingSpinner from '../components/LoadingSpinner'
import { FaArrowLeft, FaMapMarkerAlt, FaLeaf, FaInfoCircle, FaCog, FaStar, FaRegStar, FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa'

const PlantDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [tempRating, setTempRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  const isUserAdmin = checkIsAdmin(user)

  useEffect(() => {
    fetchPlantDetail()
  }, [id])

  const fetchPlantDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await plantsApi.getById(id)
      if (response.data.success) {
        setPlant(response.data.data)
        // Tìm rating của user hiện tại
        if (isAuthenticated() && user) {
          const userRate = response.data.data.ratings?.find(r => 
            isSameUser(r.user, user)
          )
          const currentRating = userRate ? userRate.rating : 0
          setUserRating(currentRating)
          setTempRating(currentRating)
          // Kiểm tra bookmark
          checkBookmark()
        }
      } else {
        setError('Không tìm thấy thực vật')
      }
    } catch (err) {
      console.error('Error fetching plant:', err)
      setError(err.response?.data?.message || 'Lỗi khi tải thông tin thực vật')
    } finally {
      setLoading(false)
    }
  }

  const checkBookmark = async () => {
    if (!isAuthenticated()) return
    try {
      const response = await bookmarksApi.check(id)
      if (response.data.success) {
        setIsBookmarked(response.data.isBookmarked)
      }
    } catch (error) {
      console.error('Error checking bookmark:', error)
    }
  }

  const handleSubmitRating = async () => {
    if (!isAuthenticated()) {
      showWarning('Vui lòng đăng nhập để đánh giá')
      return
    }
    if (tempRating === 0) {
      showWarning('Vui lòng chọn số sao để đánh giá')
      return
    }
    setRatingLoading(true)
    try {
      const response = await plantsApi.rate(id, tempRating)
      if (response.data.success) {
        setUserRating(tempRating)
        // Cập nhật average rating và ratings array
        setPlant(prev => {
          const updatedRatings = prev.ratings ? [...prev.ratings] : []
          const currentUserId = getUserId(user)
          const userRatingIndex = updatedRatings.findIndex(r => isSameUser(r.user, user))
          
          if (userRatingIndex >= 0) {
            updatedRatings[userRatingIndex] = { ...updatedRatings[userRatingIndex], rating: tempRating }
          } else {
            updatedRatings.push({ user: currentUserId, rating: tempRating })
          }
          
          return {
            ...prev,
            averageRating: response.data.data.averageRating,
            ratings: updatedRatings
          }
        })
        showSuccess('Đánh giá thành công!')
      }
    } catch (error) {
      console.error('Error rating:', error)
      const errorMsg = error.response?.data?.message || 'Lỗi khi đánh giá'
      showError(errorMsg)
      // Reset temp rating nếu có lỗi
      setTempRating(userRating)
    } finally {
      setRatingLoading(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      showWarning('Vui lòng đăng nhập để bình luận')
      return
    }
    if (!newComment.trim()) return

    setCommentLoading(true)
    try {
      const response = await plantsApi.comment(id, newComment.trim())
      if (response.data.success) {
        setPlant(prev => ({
          ...prev,
          comments: [...prev.comments, response.data.data]
        }))
        setNewComment('')
        showSuccess('Bình luận thành công!')
      }
    } catch (error) {
      console.error('Error commenting:', error)
      showError('Lỗi khi bình luận')
    } finally {
      setCommentLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return

    try {
      const response = await plantsApi.deleteComment(id, commentId)
      if (response.data.success) {
        setPlant(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== commentId)
        }))
        showSuccess('Xóa bình luận thành công!')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      showError('Lỗi khi xóa bình luận')
    }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated()) {
      showWarning('Vui lòng đăng nhập để thêm vào yêu thích')
      return
    }

    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        const response = await bookmarksApi.remove(id)
        if (response.data.success) {
          setIsBookmarked(false)
          showSuccess('Đã xóa khỏi yêu thích')
        }
      } else {
        const response = await bookmarksApi.add(id)
        if (response.data.success) {
          setIsBookmarked(true)
          showSuccess('Đã thêm vào yêu thích')
        }
      }
    } catch (error) {
      console.error('Error bookmarking:', error)
      const errorMsg = error.response?.data?.message || 'Lỗi khi cập nhật yêu thích'
      showError(errorMsg)
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Đang tải thông tin thực vật..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <FaInfoCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Lỗi</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              to="/plants"
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <FaInfoCircle className="text-yellow-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Không tìm thấy</h2>
            <p className="text-yellow-700 mb-4">Thực vật không tồn tại hoặc đã bị xóa</p>
            <Link
              to="/plants"
              className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const infoSections = [
    {
      title: 'Mô tả',
      content: plant.description,
      icon: <FaInfoCircle className="text-blue-500" />
    },
    {
      title: 'Phân bố',
      content: plant.distribution,
      icon: <FaMapMarkerAlt className="text-green-500" />
    },
    {
      title: 'Đặc điểm',
      content: plant.characteristics,
      icon: <FaLeaf className="text-primary-500" />
    },
    {
      title: 'Công dụng',
      content: plant.uses,
      icon: <FaCog className="text-purple-500" />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/plants"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại danh sách thực vật
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-green-600 text-white p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{plant.name}</h1>
                <p className="text-xl text-primary-100 italic">{plant.scientificName}</p>
                {plant.family && (
                  <span className="inline-block bg-primary-700 text-primary-100 px-3 py-1 rounded-full text-sm mt-3">
                    Họ: {plant.family}
                  </span>
                )}
                {/* Rating Display */}
                <div className="flex items-center mt-3">
                  <div className="flex items-center mr-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-yellow-300 ${star <= Math.round(plant.averageRating || 0) ? 'text-yellow-300' : 'text-gray-400'}`}
                      />
                    ))}
                    <span className="ml-2 text-primary-100">
                      ({plant.averageRating?.toFixed(1) || 0}) - {plant.ratings?.length || 0} đánh giá
                    </span>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {/* Rating Form - Only for non-admin users */}
                {isAuthenticated() && !isUserAdmin && (
                  <div className="bg-primary-700 p-4 rounded-lg">
                    <div className="text-center">
                      <span className="text-primary-100 block mb-2 font-medium">
                        {userRating > 0 ? `Đánh giá của bạn (hiện tại: ${userRating} sao)` : 'Đánh giá thực vật này'}
                      </span>
                      <div className="flex justify-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setTempRating(star)}
                            disabled={ratingLoading}
                            className="text-2xl hover:scale-110 transition-transform disabled:opacity-50 mx-1"
                          >
                            {star <= tempRating ? (
                              <FaStar className="text-yellow-300" />
                            ) : (
                              <FaRegStar className="text-primary-100 hover:text-yellow-300" />
                            )}
                          </button>
                        ))}
                      </div>
                      {tempRating > 0 && (
                        <div className="text-primary-100 text-sm mb-3">
                          Đã chọn: {tempRating} sao
                        </div>
                      )}
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={handleSubmitRating}
                          disabled={ratingLoading || tempRating === 0}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {ratingLoading ? 'Đang gửi...' : (userRating > 0 ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
                        </button>
                        {tempRating !== userRating && (
                          <button
                            onClick={() => setTempRating(userRating)}
                            disabled={ratingLoading}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Bookmark - Only for non-admin users */}
                {isAuthenticated() && !isUserAdmin && (
                  <button
                    onClick={handleBookmark}
                    disabled={bookmarkLoading}
                    className="flex items-center space-x-2 bg-primary-700 hover:bg-primary-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isBookmarked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isBookmarked ? 'Đã yêu thích' : 'Yêu thích'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400/22c55e/white?text=🌱+' + encodeURIComponent(plant.name)
                  }}
                />
              </div>
              
              {/* Quick Info */}
              {(plant.habitat || plant.growthConditions) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Thông tin bổ sung</h3>
                  <div className="space-y-2 text-sm">
                    {plant.habitat && (
                      <div>
                        <span className="font-medium">Môi trường sống:</span>
                        <span className="text-gray-600 ml-2">{plant.habitat}</span>
                      </div>
                    )}
                    {plant.growthConditions && (
                      <div>
                        <span className="font-medium">Điều kiện phát triển:</span>
                        <span className="text-gray-600 ml-2">{plant.growthConditions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Information */}
            <div className="space-y-6">
              {infoSections.map((section, index) => (
                section.content && (
                  <div key={index} className="bg-gray-50 rounded-lg p-5">
                    <div className="flex items-center mb-3">
                      {section.icon}
                      <h3 className="text-lg font-semibold text-gray-800 ml-2">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Comments Section - Hidden for admins */}
          {!isUserAdmin && (
            <div className="border-t bg-gray-50 p-6">
              <div className="flex items-center mb-4">
                <FaComment className="text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Bình luận ({plant.comments?.length || 0})
                </h3>
              </div>

              {/* Comment Form - Only for non-admin users */}
              {isAuthenticated() && !isUserAdmin ? (
                <form onSubmit={handleComment} className="mb-6">
                  <div className="flex space-x-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      rows="3"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      disabled={commentLoading}
                    />
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {commentLoading ? 'Đang gửi...' : 'Gửi'}
                    </button>
                  </div>
                </form>
              ) : isAuthenticated() && isUserAdmin ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-700">
                    Admin chỉ có thể quản lý thực vật, không thể bình luận.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-700">
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                      Đăng nhập
                    </Link> để tham gia bình luận
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {plant.comments?.length > 0 ? (
                  plant.comments.map((comment) => (
                    <div key={comment._id} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-medium text-gray-800">
                              {comment.user?.username || 'Người dùng'}
                            </span>
                            <span className="text-gray-500 text-sm ml-4">
                              {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                        {(isSameUser(user, comment.user) || checkIsAdmin(user)) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700 ml-4"
                            title="Xóa bình luận"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaComment className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                  </div>
                )}
              </div>
            </div>
          )}          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <div>
                Thông tin cập nhật: {new Date(plant.updatedAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="mt-2 sm:mt-0">
                ID: {plant._id.slice(-8)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetail