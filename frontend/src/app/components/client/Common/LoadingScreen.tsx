export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700 dark:text-black-200">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
}
