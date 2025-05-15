"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { RootState } from "@/redux";
import { removeFromCart, updateQuantity } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { fmt } from "@/utils/fmt";
import Link from "next/link";
import Image from "next/image";

const ViewCart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);

  // Tính toán các giá trị tổng
  const {
    totalOriginal,
    totalDiscount,
    totalFinal
  } = items.reduce((acc, item) => {
    const originalPrice = item.price * item.quantity;
    const discountPrice = item.discountPrice 
      ? (item.price - item.discountPrice) * item.quantity 
      : 0;
    
    return {
      totalOriginal: acc.totalOriginal + originalPrice,
      totalDiscount: acc.totalDiscount + discountPrice,
      totalFinal: acc.totalFinal + (item.discountPrice ?? item.price) * item.quantity
    };
  }, { totalOriginal: 0, totalDiscount: 0, totalFinal: 0 });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (!user) router.push("/login");
    else router.push("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiShoppingBag className="mr-3" />
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-500 mt-2">
            {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">
                  <div className="col-span-5">Sản phẩm</div>
                  <div className="col-span-3 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                </div>

                {/* Cart Items */}
                {items.map((item) => {
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
                  const itemTotal = (item.discountPrice ?? item.price) * item.quantity;
                  const itemOriginalTotal = item.price * item.quantity;
                  
                  return (
                    <div
                      key={item._id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b last:border-b-0"
                    >
                      {/* Product Info */}
                      <div className="md:col-span-5 flex items-start gap-4">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={item.image!}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h3>
                          {hasDiscount && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              Giảm {fmt(item.price - item.discountPrice!)}
                            </span>
                          )}
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="mt-2 flex items-center text-sm text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 className="mr-1" />
                            Xóa
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-3 flex flex-col items-center">
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-500 line-through text-sm">
                              {fmt(item.price)}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {fmt(item.discountPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-900">
                            {fmt(item.price)}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex md:block items-center mt-2">
                        <div className="flex border rounded-md w-fit mx-auto">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-x text-center min-w-[30px] text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 flex flex-col items-end">
                        {hasDiscount && (
                          <span className="text-gray-500 line-through text-sm">
                            {fmt(itemOriginalTotal)}
                          </span>
                        )}
                        <span className="font-medium text-gray-900">
                          {fmt(itemTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <div className="mt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <FiArrowLeft className="mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Tóm tắt đơn hàng
                </h2>

                {/* Summary Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng giá gốc</span>
                    <span>{fmt(totalOriginal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá sản phẩm</span>
                    <span className="text-red-500">-{fmt(totalDiscount)}</span>
                  </div>
                  
                  <div className="border-t pt-3"></div>
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng thanh toán</span>
                    <span className="text-indigo-600">{fmt(totalFinal)}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="text-sm text-green-600 text-right">
                      Bạn đã tiết kiệm được {fmt(totalDiscount)}
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCart;