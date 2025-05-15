// File: /app/payment-failed/page.js
"use client";
import { useSearchParams } from "next/navigation";
import { FiXCircle } from "react-icons/fi";
import Link from "next/link";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "Không rõ nguyên nhân";

  const getErrorMessage = () => {
    switch (reason) {
      case "User cancel":
        return "Bạn đã hủy thanh toán";
      case "Payment expired":
        return "Thời gian thanh toán đã hết hạn";
      case "Insufficient balance":
        return "Tài khoản không đủ số dư";
      default:
        return "Thanh toán không thành công";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="bg-red-100 p-4 rounded-full inline-flex mb-4">
          <FiXCircle className="text-red-500 text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {getErrorMessage()}
        </h1>
        <p className="text-gray-600 mb-6">
          Đơn hàng của bạn chưa được thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </p>

        {reason && reason !== "null" && (
          <div className="bg-gray-100 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Lý do:</span> {reason}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cart"
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Quay lại giỏ hàng
          </Link>
          <Link
            href="/products"
            className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}