"use client";
import { useState } from "react";
import { deleteBlog } from "@/utils/blogApi";
import toast from "react-hot-toast";
import { BlogItem } from "@/type/BlogItem";
import { deleteOldImage } from "@/utils/deleteOldImage";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import BlogFormModal from "./BlogForm";
import ConfirmDeleteModal from "../../Confirm";
import Image from "next/image";
import { useFetchBlogs } from "@/services/useFetchBlogs";

export default function BlogManager() {
  // const [blogs, setBlogs] = useState<BlogItem[]>([]);
  // const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { blogs = [], isLoading, mutate } = useFetchBlogs();

  // const fetchBlogs = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await getAllBlogs();
  //     setBlogs(data);
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchBlogs();
  // }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredBlogs = blogs.filter(
    (blog: BlogItem) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.content &&
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const handleAdd = () => {
    setSelectedBlog(null);
    setShowModal(true);
  };

  const handleEdit = (blog: BlogItem) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteBlog(blogToDelete._id!);
      if (blogToDelete.image) {
        await deleteOldImage(blogToDelete.image);
      }
      toast.success("Xóa bài viết thành công");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (blog: BlogItem) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FaSearch className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            onClick={handleAdd}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Thêm mới
          </button>
        </div>
      </div>

      {isLoading && blogs.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentBlogs.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy bài viết
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có bài viết nào được tạo"}
          </p>
          {!searchTerm && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleAdd}
            >
              Thêm bài viết mới
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tiêu đề
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hình ảnh
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBlogs.map((blog: BlogItem) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {blog.content?.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {blog.image ? (
                          <Image
                            src={blog.image}
                            alt={blog.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            blog.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(blog)}
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredBlogs.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredBlogs.length}</span> bài
                viết
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map(
                  (_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded-md ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <BlogFormModal
          blog={selectedBlog}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            mutate();
            setCurrentPage(1);
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content="Bạn có chắc chắn muốn xóa bài viết này?"
      />
    </div>
  );
}
