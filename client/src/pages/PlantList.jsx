import { useState, useEffect } from 'react'
import { plantsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ToastNotification'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FaList, FaPlus, FaExclamationCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const PlantList = () => {
  const { isAdmin } = useAuth()
  const { showSuccess, showError } = useToast()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [plantToDelete, setPlantToDelete] = useState(null)

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    try {
      setLoading(true)
      const response = await plantsApi.getAll()
      console.log('Fetch plants response:', response.data)
      if (response.data.success) {
        const plantsData = response.data.data
        console.log('Plants data:', plantsData)
        console.log('First plant ID:', plantsData[0]?._id)
        console.log('First plant ID type:', typeof plantsData[0]?._id)
        setPlants(plantsData)
      } else {
        setError('Không thể tải danh sách thực vật')
      }
    } catch (err) {
      console.error('Error fetching plants:', err)
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách thực vật')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (plant) => {
    console.log('Delete button clicked for plant:', plant)
    console.log('Plant ID:', plant._id)
    console.log('Plant ID type:', typeof plant._id)
    console.log('Plant ID length:', plant._id?.length)
    setPlantToDelete(plant)
    setOpenConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (plantToDelete) {
      try {
        console.log('About to delete plant with ID:', plantToDelete._id)
        console.log('Making DELETE request to:', `/plants/${plantToDelete._id}`)
        const response = await plantsApi.delete(plantToDelete._id)
        console.log('Delete response:', response.data)
        if (response.data.success) {
          setPlants(plants.filter(plant => plant._id !== plantToDelete._id))
          showSuccess('Xóa thực vật thành công!')
        }
      } catch (err) {
        console.error('Error deleting plant:', err)
        console.error('Error response:', err.response?.data)
        showError(err.response?.data?.message || 'Lỗi khi xóa thực vật')
      }
    }
    setOpenConfirm(false)
    setPlantToDelete(null)
  }

  const handleCancelDelete = () => {
    setOpenConfirm(false)
    setPlantToDelete(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FaList className="text-3xl text-primary-600 mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Danh sách thực vật
              </h1>
              <p className="text-gray-600 mt-1">
                Khám phá bộ sưu tập thực vật đa dạng
              </p>
            </div>
          </div>

          {isAdmin() && (
            <Link
              to="/add-plant"
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Thêm thực vật mới
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner text="Đang tải danh sách thực vật..." />}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Lỗi tải dữ liệu</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchPlants}
                  className="text-red-600 hover:text-red-700 underline mt-2"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plants Grid */}
        {!loading && !error && (
          <div className="fade-in">
            {plants.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Hiển thị {plants.length} thực vật
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plants.map((plant) => (
                    <PlantCard
                      key={plant._id}
                      plant={plant}
                      showActions={isAdmin()}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FaList className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chưa có thực vật nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Danh sách thực vật hiện tại đang trống
                </p>
                {isAdmin() && (
                  <Link
                    to="/add-plant"
                    className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FaPlus className="mr-2" />
                    Thêm thực vật đầu tiên
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal */}
        {openConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa</h3>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa thực vật "{plantToDelete?.name}" không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlantList