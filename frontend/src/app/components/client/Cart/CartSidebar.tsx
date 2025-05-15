"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { RootState } from "@/redux";
import { removeFromCart, toggleCart } from "@/redux/cartSlice";
import { useRouter } from "next/navigation";
import { fmt } from "@/utils/fmt";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.cart.isOpen);
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);

  const total = items.reduce((sum, item) => {
    const price = item.discountPrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  const handlePaymentClick = () => {
    if (!user) router.push("/login");
    else router.push("/checkout");
    dispatch(toggleCart());
  };

  return (
    <>
      {/* Overlay mờ */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] z-50`} // z-50 để cao hơn navbar
          onClick={() => dispatch(toggleCart())}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-xl z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Giỏ hàng</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="px-6 py-4 overflow-y-auto h-[calc(100%-210px)] space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 italic mt-10">
              Không có sản phẩm nào trong giỏ hàng.
            </p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {item.discountPrice && item.discountPrice < item.price ? (
                        <>
                          <p className="text-sm text-red-500 font-medium">
                            {fmt(item.discountPrice)}
                          </p>
                          <p className="text-sm text-gray-400 line-through">
                            {fmt(item.price)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {fmt(item.price)}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  <FiTrash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-slate-700">
              Tổng tiền:
            </span>
            <span className="text-lg font-bold text-slate-800">
              {fmt(total)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                dispatch(toggleCart());
                router.push("/cart");
              }}
              className="flex-1 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              Chi tiết giỏ hàng
            </button>
            <button
              onClick={handlePaymentClick}
              className="flex-1 py-3 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800"
            >
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
