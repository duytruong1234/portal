import { Link } from 'react-router-dom'
import { FaEye, FaEdit, FaTrash, FaHeart } from 'react-icons/fa'

const PlantCard = ({ plant, showActions = false, onDelete, showBookmark = false, isBookmarked = false }) => {
  const handleDelete = () => {
    onDelete(plant)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/22c55e/white?text=🌱'
          }}
        />
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          {showBookmark && isBookmarked && (
            <FaHeart className="text-red-500 text-lg" />
          )}
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {plant.family || 'Họ thực vật'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {plant.name}
          </h3>
          <p className="text-sm text-gray-500 italic">
            {plant.scientificName}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {plant.description?.length > 100 
            ? `${plant.description.substring(0, 100)}...` 
            : plant.description
          }
        </p>

        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-1">
            📍 {plant.distribution?.split(',')[0] || 'Không rõ'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            to={`/plant/${plant._id}`}
            className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm"
          >
            <FaEye className="text-xs" />
            <span>Xem chi tiết</span>
          </Link>

          {showActions && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-plant/${plant._id}`}
                className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <FaEdit />
                <span>Sửa</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
              >
                <FaTrash />
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlantCard