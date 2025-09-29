import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { plantsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ToastNotification'
import { FaPlus, FaArrowLeft, FaSave } from 'react-icons/fa'

const AddPlant = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { showSuccess, showError, showWarning } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    image: '',
    distribution: '',
    characteristics: '',
    uses: '',
    family: '',
    habitat: '',
    growthConditions: ''
  })

  // Redirect nếu không phải admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Truy cập bị từ chối</h2>
            <p className="text-red-700 mb-4">Chỉ admin mới có thể thêm thực vật mới</p>
            <button
              onClick={() => navigate('/plants')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const requiredFields = ['name', 'scientificName', 'description', 'distribution', 'characteristics', 'uses']
    const missingFields = requiredFields.filter(field => !formData[field].trim())
    
    if (missingFields.length > 0) {
      showWarning(`Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(', ')}`)
      return
    }

    try {
      setLoading(true)
      const response = await plantsApi.create(formData)
      
      if (response.data.success) {
        showSuccess('Thêm thực vật thành công!')
        navigate('/plants')
      }
    } catch (err) {
      console.error('Error creating plant:', err)
      showError(err.response?.data?.message || 'Lỗi khi thêm thực vật')
    } finally {
      setLoading(false)
    }
  }

  const inputFields = [
    { name: 'name', label: 'Tên thực vật', required: true, placeholder: 'VD: Hoa hồng' },
    { name: 'scientificName', label: 'Tên khoa học', required: true, placeholder: 'VD: Rosa damascena' },
    { name: 'family', label: 'Họ thực vật', required: false, placeholder: 'VD: Rosaceae' },
    { name: 'image', label: 'Link hình ảnh', required: false, placeholder: 'https://...' }
  ]

  const textareaFields = [
    { name: 'description', label: 'Mô tả', required: true, placeholder: 'Mô tả chi tiết về thực vật...' },
    { name: 'distribution', label: 'Phân bố', required: true, placeholder: 'Khu vực phân bố của thực vật...' },
    { name: 'characteristics', label: 'Đặc điểm', required: true, placeholder: 'Đặc điểm hình thái, sinh học...' },
    { name: 'uses', label: 'Công dụng', required: true, placeholder: 'Công dụng và ứng dụng...' },
    { name: 'habitat', label: 'Môi trường sống', required: false, placeholder: 'Môi trường sống tự nhiên...' },
    { name: 'growthConditions', label: 'Điều kiện phát triển', required: false, placeholder: 'Nhiệt độ, độ ẩm, ánh sáng...' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/plants')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Quay lại danh sách thực vật
          </button>
          
          <div className="flex items-center">
            <FaPlus className="text-3xl text-primary-600 mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Thêm thực vật mới
              </h1>
              <p className="text-gray-600 mt-1">
                Điền thông tin chi tiết về thực vật
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h3>
              <div className="space-y-4">
                {textareaFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-vertical"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Image */}
            {formData.image && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước hình ảnh</h3>
                <div className="max-w-md">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/plants')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="mr-2" />
                {loading ? 'Đang lưu...' : 'Lưu thực vật'}
              </button>
            </div>
          </form>
        </div>

        {/* Required Fields Note */}
        <div className="mt-4 text-sm text-gray-500">
          <span className="text-red-500">*</span> Trường bắt buộc
        </div>
      </div>
    </div>
  )
}

export default AddPlant