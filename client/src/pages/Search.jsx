import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { plantsApi } from '../services/api'
import SearchBox from '../components/SearchBox'
import PlantCard from '../components/PlantCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FaSearch, FaExclamationCircle, FaFilter } from 'react-icons/fa'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    family: '',
    habitat: '',
    uses: '',
    distribution: ''
  })

  // Lấy query từ URL khi component mount
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [searchParams])

  const handleSearch = async (query) => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setHasSearched(true)
    setSearchQuery(query)

    // Update URL
    setSearchParams({ q: query })

    try {
      const response = await plantsApi.search(query)
      if (response.data.success) {
        setPlants(response.data.data)
      } else {
        setError('Có lỗi xảy ra khi tìm kiếm')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err.response?.data?.message || 'Lỗi khi tìm kiếm thực vật')
    } finally {
      setLoading(false)
    }
  }

  const handleAdvancedSearch = async () => {
    setLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const response = await plantsApi.advancedSearch(filters)
      if (response.data.success) {
        setPlants(response.data.data)
      } else {
        setError('Có lỗi xảy ra khi tìm kiếm nâng cao')
      }
    } catch (err) {
      console.error('Advanced search error:', err)
      setError(err.response?.data?.message || 'Lỗi khi tìm kiếm nâng cao')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaSearch className="text-4xl text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tìm kiếm thực vật
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Nhập tên thực vật, tên khoa học hoặc từ khóa để tìm kiếm
          </p>
        </div>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <SearchBox 
            onSearch={handleSearch}
            loading={loading}
            placeholder="VD: Hoa hồng, Rosa, cây cảnh..."
          />
        </div>

        {/* Advanced Search Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FaFilter />
            {showAdvanced ? 'Ẩn' : 'Hiển thị'} tìm kiếm nâng cao
          </button>
        </div>

        {/* Advanced Search Form */}
        {showAdvanced && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Tìm kiếm nâng cao</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ thực vật</label>
                <input
                  type="text"
                  name="family"
                  value={filters.family}
                  onChange={handleFilterChange}
                  placeholder="VD: Rosaceae"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môi trường sống</label>
                <input
                  type="text"
                  name="habitat"
                  value={filters.habitat}
                  onChange={handleFilterChange}
                  placeholder="VD: Rừng nhiệt đới"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Công dụng</label>
                <input
                  type="text"
                  name="uses"
                  value={filters.uses}
                  onChange={handleFilterChange}
                  placeholder="VD: Trang trí"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vùng phân bố</label>
                <input
                  type="text"
                  name="distribution"
                  value={filters.distribution}
                  onChange={handleFilterChange}
                  placeholder="VD: Việt Nam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAdvancedSearch}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm nâng cao'}
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {loading && (
          <LoadingSpinner text="Đang tìm kiếm thực vật..." />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Lỗi tìm kiếm</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <div className="fade-in">
            {plants.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Tìm thấy {plants.length} kết quả cho "{searchQuery}"
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plants.map((plant) => (
                    <PlantCard key={plant._id} plant={plant} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-6">
                  Không tìm thấy thực vật nào với từ khóa "{searchQuery}"
                </p>
                <div className="text-sm text-gray-500">
                  <p className="mb-2">Gợi ý:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Kiểm tra lại chính tả</li>
                    <li>Thử tìm kiếm với từ khóa ngắn hơn</li>
                    <li>Sử dụng tên phổ biến của thực vật</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && (
          <div className="text-center py-12">
            <div className="bg-primary-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Bắt đầu tìm kiếm
            </h3>
            <p className="text-gray-600 mb-6">
              Nhập tên thực vật hoặc từ khóa vào ô tìm kiếm phía trên
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">Ví dụ tìm kiếm:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hoa hồng', 'Rosa', 'Tre trúc', 'Sen đá', 'Lan hồ điệp'].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSearch(example)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search