"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Product } from "@/types/Product";
import { AppDispatch } from "@/redux";
import { addToCart } from "@/redux/cartSlice";
import Rating from "../Rating";
import { fmt } from "@/utils/fmt";

interface ShopDetailsProps {
  product: Product;
  onClose: () => void;
}

const CardDetails: React.FC<ShopDetailsProps> = ({ product, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantityToBuy : quantity,
      })
    );
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl max-w-5xl w-full p-6 md:p-10 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 rounded-lg">
            {product.images ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">No Image</div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[60px] mt-1.5">
                Đánh giá:
              </label>
              <Rating rating={product.rating!} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả:
              </label>
              <p className="text-gray-600 mt-1.5">{product.description}</p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Giá:
              </label>
              <span className="text-xl font-bold text-blue-600">
                {fmt(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-sm line-through text-gray-400">
                  {fmt(product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="text-sm font-medium text-gray-700 min-w-[70px]">
                Số lượng:
              </label>

              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition duration-150"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-12 text-center bg-transparent outline-none appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-3 py-1 text-gray-700 hover:bg-gray-200 transition duration-150"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
