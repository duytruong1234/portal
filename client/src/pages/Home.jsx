import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaLeaf, FaBook, FaUsers } from 'react-icons/fa'
import SearchBox from '../components/SearchBox'
import { plantsApi } from '../services/api'

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState([
    { number: '0', label: 'Loài thực vật' },
    { number: '0', label: 'Họ thực vật' },
    { number: '100%', label: 'Miễn phí' },
    { number: '24/7', label: 'Truy cập' }
  ])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await plantsApi.getAll()
      if (response.data.success) {
        const plants = response.data.data
        const families = [...new Set(plants.map(p => p.family).filter(f => f))]
        setStats([
          { number: plants.length.toString(), label: 'Loài thực vật' },
          { number: families.length.toString(), label: 'Họ thực vật' },
          { number: '100%', label: 'Miễn phí' },
          { number: '24/7', label: 'Truy cập' }
        ])
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const features = [
    {
      icon: <FaSearch className="text-3xl text-primary-600" />,
      title: 'Tìm kiếm nhanh',
      description: 'Tra cứu thông tin thực vật theo tên hoặc tên khoa học một cách nhanh chóng và chính xác.'
    },
    {
      icon: <FaBook className="text-3xl text-primary-600" />,
      title: 'Thông tin chi tiết',
      description: 'Cung cấp thông tin đầy đủ về đặc điểm, phân bố, công dụng của từng loài thực vật.'
    },
    {
      icon: <FaLeaf className="text-3xl text-primary-600" />,
      title: 'Dữ liệu phong phú',
      description: 'Cơ sở dữ liệu lớn với hàng nghìn loài thực vật từ khắp nơi trên thế giới.'
    },
    {
      icon: <FaUsers className="text-3xl text-primary-600" />,
      title: 'Cộng đồng',
      description: 'Kết nối với cộng đồng yêu thích thực vật, chia sẻ kiến thức và kinh nghiệm.'
    }
  ]

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 p-4 rounded-full">
                <FaLeaf className="text-5xl text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cổng Thông Tin
              <span className="text-primary-600 block">Thực Vật</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Khám phá thế giới thực vật với thông tin chi tiết, chính xác và cập nhật. 
              Tra cứu hàng nghìn loài cây từ khắp nơi trên thế giới.
            </p>
            
            {/* Search Box */}
            <div className="flex justify-center mb-8">
              <SearchBox 
                onSearch={handleSearch}
                loading={loading}
                placeholder="Tìm kiếm thực vật... (VD: Hoa hồng, Rosa)"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/plants')}
                className="bg-primary-600 text-white px-6 py-3 rounded-full hover:bg-primary-700 transition-colors font-medium"
              >
                Xem tất cả thực vật
              </button>
              <button
                onClick={() => navigate('/search')}
                className="bg-white text-primary-600 px-6 py-3 rounded-full border-2 border-primary-600 hover:bg-primary-50 transition-colors font-medium"
              >
                Tìm kiếm nâng cao
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Plant Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp công cụ tra cứu thực vật toàn diện và dễ sử dụng nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bắt đầu khám phá ngay hôm nay!
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng yêu thích thực vật và khám phá những điều kỳ diệu của thiên nhiên
          </p>
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-primary-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Khám phá ngay
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home