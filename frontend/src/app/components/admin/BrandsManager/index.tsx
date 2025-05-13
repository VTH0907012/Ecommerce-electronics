
"use client";
import { useEffect, useState } from "react";
import { getAllBrands, deleteBrand } from "@/utils/brandApi";
import { Brand } from "@/type/Brand";
import toast from "react-hot-toast";
import { deleteOldImage } from "@/utils/deleteOldImage";
import { FaEdit, FaTrash } from "react-icons/fa";
import BrandForm from "./BrandForm";
import ConfirmDeleteModal from "../../Confirm";

export default function BrandManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = () => {
    setSelectedBrand(null);
    setShowModal(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  };

    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
  
 const handleDelete = async () => {
    if (!brandToDelete) return;
    try {
      await deleteBrand(brandToDelete._id!);
      if (brandToDelete.image) {
        await deleteOldImage(brandToDelete.image);
      }
      toast.success("Xóa blogs thành công");
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false); 
    }
  };

  const confirmDelete = (blog: Brand) => {
    setBrandToDelete(blog);
    setShowDeleteModal(true);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Nhãn hiệu</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm nhãn hiệu..."
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

      {isLoading && brands.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentBrands.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">
            Không tìm thấy nhãn hiệu
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có nhãn hiệu nào được tạo"}
          </p>
          {!searchTerm && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              onClick={handleAdd}
            >
              Thêm nhãn hiệu mới
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên nhãn hiệu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBrands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {brand.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 line-clamp-2 max-w-xs">
                        {brand.description || "Không có mô tả"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {brand.image ? (
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="h-10 w-10 object-contain rounded-full"
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
                                d="M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Sửa"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(brand)}
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
                  {Math.min(indexOfLastItem, filteredBrands.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredBrands.length}</span>{" "}
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

      {/* Modal Form */}
      {showModal && (
        <BrandForm
          onClose={() => setShowModal(false)}
          brand={selectedBrand}
          onSuccess={() => {
            setShowModal(false);
            fetchBrands();
            setCurrentPage(1);
          }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content="Bạn có chắc chắn muốn xóa nhãn hiệu này?"
      />
    </div>
  );
}
