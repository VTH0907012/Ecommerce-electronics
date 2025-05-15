// File: /app/order-success/[orderId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";
import { Order } from "@/type/Order";
import { getOrderdetails } from "@/utils/orderApi";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/cartSlice";

export default function OrderSuccess() {
    const dispatch = useDispatch();

  const router = useRouter();
  const params = useParams(); // Lấy params từ URL

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch(clearCart())
        const data = await getOrderdetails(params.orderId);
        console.log(data);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <FiCheckCircle className="text-red-500 text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Không tìm thấy đơn hàng
        </h1>
        <p className="text-gray-600 mb-6">
          Đơn hàng bạn yêu cầu không tồn tại hoặc đã bị hủy
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 p-6 border-b border-green-100">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <FiCheckCircle className="text-green-600 text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Đặt hàng thành công!
              </h1>
            </div>
            <p className="text-center text-gray-600">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.
            </p>
          </div>

          {/* Order Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FiShoppingBag className="text-blue-600 mr-2" />
                  <h2 className="font-medium text-gray-800">
                    Thông tin đơn hàng
                  </h2>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Mã đơn hàng:</span> {order._id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ngày đặt:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Tổng tiền:</span>{" "}
                  {order.total.toLocaleString("vi-VN")}₫
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phương thức:</span>{" "}
                  {order.shippingInfo.paymentMethod === "cod" ? "COD" : "VNPay"}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FiMapPin className="text-purple-600 mr-2" />
                  <h2 className="font-medium text-gray-800">
                    Địa chỉ nhận hàng
                  </h2>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {order.shippingInfo.fullName} | {order.shippingInfo.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingInfo.address}
                </p>
                {order.shippingInfo.note && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {order.shippingInfo.note}
                  </p>
                )}
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FiClock className="text-gray-600 mr-2" />
                <h2 className="font-medium text-gray-800">
                  Tình trạng đơn hàng
                </h2>
              </div>
              <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                <div className="relative">
                  <div className="absolute -left-7 top-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="pl-2">
                    <p className="font-medium text-gray-800">
                      Đơn hàng đã xác nhận
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-7 top-0.5 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="pl-2">
                    <p className="font-medium text-gray-800">
                      Đang chuẩn bị hàng
                    </p>
                    <p className="text-sm text-gray-500">Dự kiến trong 24h</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-7 top-0.5 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="pl-2">
                    <p className="font-medium text-gray-800">Đang giao hàng</p>
                    <p className="text-sm text-gray-500">
                      Sau khi chuẩn bị xong
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 transition text-center"
              >
                Tiếp tục mua sắm
              </Link>
              {/* <Link
                href={`/account/orders/${order._id}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Xem chi tiết đơn hàng
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
