"use client";
import {  useState } from "react";
import { Category } from "@/types/Category";
import toast from "react-hot-toast";
import { deleteOldImage } from "@/utils/deleteOldImage";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteCategory,  } from "@/utils/cateApi";
import CategoryFormModal from "./CategoryForm";
import ConfirmDeleteModal from "../../Confirm";
import Image from "next/image";
import useFetchCategories from "@/services/useFetchCategories";

export default function CategoryManager() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const {categories = [], isLoading, mutate } = useFetchCategories();
  // const [isLoading, setIsLoading] = useState(false);
  // const [categories, setCategories] = useState<Category[]>([]);
  // const fetchCategories = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await getAllCategorys();
  //     setCategories(data);
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete._id!);
      if (categoryToDelete.image) {
        await deleteOldImage(categoryToDelete.image);
      }
      toast.success("Xóa danh mục thành công");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (cate: Category) => {
    setCategoryToDelete(cate);
    setShowDeleteModal(true);
  };
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
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

      {isLoading && categories.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentCategories.length === 0 ? (
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
            Không tìm thấy danh mục
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có danh mục nào được tạo"}
          </p>
          {!searchTerm && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleAdd}
            >
              Thêm danh mục mới
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
                      Tên danh mục
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mô tả
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hình ảnh
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
                  {currentCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {cat.description || "Không có mô tả"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={40} // h-10 = 40px
                            height={40}
                            className="object-contain rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(cat)}
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

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredCategories.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                danh mục
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
        <CategoryFormModal
          category={selectedCategory}
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
        content="Bạn có chắc chắn muốn xóa danh mục này?"
      />
    </div>
  );
}
