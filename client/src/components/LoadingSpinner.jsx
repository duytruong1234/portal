const LoadingSpinner = ({ size = 'medium', text = 'Đang tải...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`loading-spinner ${sizeClasses[size]} mb-4`}></div>
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  )
}

export default LoadingSpinner