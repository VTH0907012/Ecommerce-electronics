"use client";
import { useFetchOrders } from "@/services/useFetchOrder";
import {  OrderStatus } from "@/types/Order";
import {  updateOrderStatus } from "@/utils/orderApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

export default function OrderManager() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const {orders = [], isLoading, mutate} = useFetchOrders();
  
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const fetchOrders = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await getAllOrders();
  //     setOrders(data);
  //   } catch (error) {
  //     toast.error("Lấy danh sách đơn hàng thất bại!");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  const itemsPerPage = 6;

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(
    (order) =>
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleUpdateStatus = async () => {
    if (selectedOrderId && newStatus) {
      try {
        await updateOrderStatus(selectedOrderId, newStatus);
        toast.success("Cập nhật trạng thái thành công!");
        mutate();
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Cập nhật trạng thái thất bại!");
        console.error(error);
      }
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending_payment_vnpay":
        return "Chờ thanh toán VNPay";
      case "pending":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã huỷ";
      default:
        return "Không rõ";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending_payment_vnpay":
        return "bg-purple-500";
      case "pending":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
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
        </div>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentOrders.length === 0 ? (
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
            Không tìm thấy đơn hàng
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Không có kết quả phù hợp với từ khóa tìm kiếm"
              : "Chưa có đơn hàng nào được tạo"}
          </p>
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
                      Mã ĐH
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Khách hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tổng tiền
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thanh toán
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
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id?.substring(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.shippingInfo.fullName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.shippingInfo.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.total.toLocaleString("vi-VN")}₫
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {order.shippingInfo.paymentMethod}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order._id!);
                              setNewStatus(order.status as OrderStatus);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Cập nhật trạng thái"
                          >
                            <FaEdit size={18} />
                          </button>
                        )}
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
                  {Math.min(indexOfLastItem, filteredOrders.length)}
                </span>{" "}
                trong tổng số{" "}
                <span className="font-medium">{filteredOrders.length}</span> đơn
                hàng
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

      {/* Modal cập nhật trạng thái */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Cập nhật trạng thái đơn hàng
            </h3>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Trạng thái mới
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="px-3 py-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending_payment_vnpay">
                  Đang chờ thay toán vnpay
                </option>

                <option value="pending">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
