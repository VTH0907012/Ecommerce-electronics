"use client";
import {  useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaSearch } from "react-icons/fa";
import {
  deleteComment,

} from "@/utils/commentApi";
import ConfirmDeleteModal from "../../Confirm";
import { Product } from "@/types/Product";
import { Comment } from "@/types/Comment";
import {
  useFetchComments,
  useFetchCommentsByProductId,
} from "@/services/useFetchComments";

export default function CommentManager() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  //const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  //const [allComments, setAllComments] = useState<Comment[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const fetchAllComments = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await getAllComments();
  //     setAllComments(data);
  //     setFilteredComments(data);
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const fetchProductComments = async (productId: string) => {
  //   setIsLoading(true);
  //   try {
  //     const data = await getCommentById(productId);
  //     setFilteredComments(data);
  //   } catch (error: any) {
  //     toast.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchAllComments();
  // }, []);

  const { comments: allComments, isLoading, mutate } = useFetchComments();
  const {
    comments: productComments,
    //isLoading: isProductLoading,
    mutate: mutateProduct,
  } = useFetchCommentsByProductId(selectedProduct?._id || "");

  const sourceComments = selectedProduct ? productComments : allComments;
  const filteredComments = useMemo(() => {
    if (!sourceComments) return [];

    return sourceComments.filter(
      (comment) =>
        searchTerm === "" ||
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sourceComments, searchTerm]);


  // useEffect(() => {
  //   if (!searchTerm) {
  //     setFilteredComments(
  //       selectedProduct
  //         ? allComments.filter((c) => c.product?._id === selectedProduct._id)
  //         : allComments
  //     );
  //   } else {
  //     const filtered = allComments.filter(
  //       (comment) =>
  //         comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         comment.user?.name
  //           ?.toLowerCase()
  //           .includes(searchTerm.toLowerCase()) ||
  //         comment.product?.name
  //           ?.toLowerCase()
  //           .includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredComments(filtered);
  //   }
  //   setCurrentPage(1);
  // }, [searchTerm, allComments, selectedProduct]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment(commentToDelete._id!);
      toast.success("Xóa bình luận thành công");
      if (selectedProduct) {
        //fetchProductComments(selectedProduct._id!);
         mutateProduct();
      } else {
        //fetchAllComments();
        mutate();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (comment: Comment) => {
    setCommentToDelete(comment);
    setShowDeleteModal(true);
  };

  const renderUserAvatar = () => (
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
      <svg
        className="h-5 w-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedProduct
            ? `Bình luận sản phẩm: ${selectedProduct.name}`
            : "Quản lý Bình luận"}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm bình luận..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>

          {selectedProduct && (
            <button
              onClick={() => {
                setSelectedProduct(null);
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Quay lại
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentComments.length === 0 ? (
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
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không tìm thấy bình luận
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có bình luận nào được tạo"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    {!selectedProduct && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentComments.map((comment) => (
                    <tr
                      key={comment._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderUserAvatar()}
                          <div>
                            <div className="font-medium text-gray-900">
                              {comment.user?.name || "Khách"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {comment.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {comment.content}
                        </div>
                      </td>
                      {!selectedProduct && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedProduct(comment.product)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {comment.product?.name || "Sản phẩm đã xóa"}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => confirmDelete(comment)}
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

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Hiển thị {indexOfFirstItem + 1} đến{" "}
                {Math.min(indexOfLastItem, filteredComments.length)} trong tổng
                số {filteredComments.length} bình luận
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

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content="Bạn có chắc chắn muốn xóa bình luận này?"
      />
    </div>
  );
}
