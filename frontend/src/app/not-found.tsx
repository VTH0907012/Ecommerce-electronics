// app/not-found.js
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
        
        <div className="p-8 text-center">
          <div className="text-9xl font-bold text-gray-800 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Trang không tồn tại</h1>
          <p className="text-gray-600 mb-6">
            Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc không tồn tại.
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="text-6xl animate-bounce">😕</div>
          </div>
          
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}