"use client";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/redux";
import { useState } from "react";
import {
  createOrder,
  createOrderTemp,
  createVnpayPayment,
} from "@/utils/orderApi";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/cartSlice";
import {
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import { fmt } from "@/utils/fmt";

const Checkout = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  const total = items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // const handleVnpayPayment = async () => {
  //   try {
  //     // 1. Tạo orderId tạm (có thể là timestamp hoặc random string)
  //     const tempOrderId = `temp_${Date.now()}`;

  //     // 2. Chuẩn bị dữ liệu thanh toán
  //     const paymentData = {
  //       orderId: tempOrderId,
  //       amount: total,
  //       //ipAddr: await getClientIP(), // Lấy IP client
  //       orderInfo: {
  //         userId: user?._id,
  //         shippingInfo,
  //         items: items.map((item) => ({
  //           productId: item._id,
  //           name: item.name,
  //           quantity: item.quantity,
  //           price: item.discountPrice ?? item.price,
  //         })),
  //         total,
  //       },
  //     };

  //     // 3. Gọi API tạo thanh toán VNPay
  //     const response = await createVnpayPayment(paymentData);

  //     // 4. Chuyển hướng đến VNPay
  //     //window.location.href = response.paymentUrl;
  //     console.log(response.paymentUrl);
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error("Lỗi khi tạo thanh toán VNPay");
  //   }
  // };

  const handleVnpayPayment = async () => {
    try {
      // 1. Tạo đơn hàng tạm
      const response = await createOrderTemp({
        userId: user?._id,
        shippingInfo,
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.discountPrice ?? item.price,
        })),
        total,
      });

      console.log("Full API response:", response); // Debug toàn bộ response

      // 2. Kiểm tra cấu trúc response
      if (!response?.order?._id) {
        throw new Error("Invalid order data structure");
      }

      // 3. Gọi API thanh toán với orderId
      const paymentResponse = await createVnpayPayment({
        orderId: response.order._id, // Truy cập đúng đường dẫn
      });

      // 4. Chuyển hướng
      window.location.href = paymentResponse.paymentUrl;
    } catch (error: any) {
      console.error("Payment error details:", {
        error: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Lỗi thanh toán");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("Vui lòng đăng nhập trước khi thanh toán!");
      return;
    }
    if (shippingInfo.paymentMethod === "vnpay") {
      return handleVnpayPayment();
    }
    const orderData = {
      userId: user._id,
      shippingInfo,
      items: items.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        name: item.name,
        price: item.discountPrice ?? item.price,
      })),
      total: total,
    };

    try {
      const data = await createOrder(orderData);
      console.log(data);
      //toast.success("Đặt hàng thành công!");
      dispatch(clearCart());

      router.push(`/order-success/${data.order._id}`);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi đặt hàng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <FiShoppingBag className="text-2xl text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiTruck className="text-blue-600 text-lg" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin giao hàng
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleChange}
                      required
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú (tuỳ chọn)
                  </label>
                  <textarea
                    name="note"
                    value={shippingInfo.note}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Ví dụ: Giao hàng giờ hành chính..."
                  />
                </div>

                <div className="pt-4">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FiCreditCard className="text-blue-600 text-lg" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Phương thức thanh toán
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start p-4 border rounded-xl cursor-pointer hover:border-blue-400 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={shippingInfo.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng
                        </p>
                      </div>
                    </label>

                    {/* <label className="flex items-start p-4 border rounded-xl cursor-pointer hover:border-blue-400 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={shippingInfo.paymentMethod === "bank"}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          Chuyển khoản ngân hàng
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Chuyển khoản qua tài khoản ngân hàng của chúng tôi
                        </p>
                      </div>
                    </label> */}
                    <label className="flex items-start p-4 border rounded-xl cursor-pointer hover:border-blue-400 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vnpay"
                        checked={shippingInfo.paymentMethod === "vnpay"}
                        onChange={handleChange}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              Thanh toán qua VNPay
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Thanh toán an toàn qua cổng VNPay (Môi trường
                              sandbox)
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-gray-700">
                              Tài liệu test case: {""}
                            </p>
                            <a
                              href="https://sandbox.vnpayment.vn/apis/vnpay-demo/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              https://sandbox.vnpayment.vn/apis/vnpay-demo/
                            </a>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-yellow-600 font-medium">
                              ⚠️ Lưu ý: Đây là cổng thanh toán test, không sử
                              dụng thông tin thật
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FiShoppingBag className="mr-2 text-blue-600" />
                Đơn hàng của bạn
              </h2>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 items-start pb-4 border-b border-gray-100"
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded-lg border"
                          />
                          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-2">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex items-center mt-1">
                            <p className="text-sm font-semibold text-red-500">
                              {fmt(item.discountPrice ?? item.price)}
                            </p>
                            {item.discountPrice! > 0 && (
                              <p className="text-xs line-through text-gray-400 ml-2">
                                {fmt(item.discountPrice)}₫
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    {/* <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span>{total.toLocaleString("vi-VN")}₫</span>
                    </div> */}

                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                      <span>Tổng cộng:</span>
                      <span>{fmt(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={items.length === 0}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    Đặt hàng ngay
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ của
                    chúng tôi
                  </p>
                </>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiDollarSign className="text-green-600 text-lg" />
                </div>
                <h3 className="font-medium text-gray-800">
                  Thanh toán an toàn
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Thông tin thanh toán của bạn được bảo mật và mã hóa. Chúng tôi
                không lưu trữ thông tin thẻ tín dụng của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
