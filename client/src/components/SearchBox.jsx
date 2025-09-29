import { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import api from '../services/api'

const SearchBox = ({ onSearch, placeholder = 'Nhập tên thực vật...', loading = false }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (query.length > 2) {
      // Gọi API để lấy gợi ý
      api.get(`/plants/suggestions?q=${query}`)
        .then(res => setSuggestions(res.data))
        .catch(err => console.error('Suggestions error:', err))
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          list="plant-suggestions"
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <datalist id="plant-suggestions">
          {suggestions.map(plant => (
            <option key={plant._id} value={plant.name} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute inset-y-0 right-0 pr-4 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full transition-colors disabled:opacity-50">
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </div>
        </button>
      </div>
    </form>
  )
}

export default SearchBox