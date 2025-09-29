import { FaLeaf, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-primary-400 text-2xl" />
              <span className="text-xl font-bold">Plant Portal</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Cổng thông tin tra cứu thực vật hàng đầu Việt Nam. Khám phá thế giới thực vật 
              với thông tin chi tiết, chính xác và cập nhật.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaGithub className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Tìm kiếm thực vật
                </a>
              </li>
              <li>
                <a href="/plants" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Danh sách thực vật
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 contact@plantportal.vn</p>
              <p>📞 (+84) 123 456 789</p>
              <p>📍 Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Plant Portal. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer