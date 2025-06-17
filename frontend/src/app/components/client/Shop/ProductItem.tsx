"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { Product } from "@/type/Product";
import { AppDispatch } from "@/redux";
import { addToCart } from "@/redux/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import { FaEye, FaHeart } from "react-icons/fa";
import Rating from "../Rating";
import { fmt } from "@/utils/fmt";
import { useRouter } from "next/navigation";

const ProductItem = ({ item }: { item: Product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleQuickView = (item: any) => {
    router.push(`/products/${item._id}`);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  const handleAddToWishlist = () => {};

  return (
    <>
      <div className="group p-2 hover:shadow-md transition duration-300">
        <div className="relative bg-gray-100 overflow-hidden mb-3 h-60 flex items-center justify-center">
          {/* <Image
            src={item.images![0] || ""}
            alt={item.name}
            width={200}
            height={200}
            className="object-contain"
          /> */}
          <Image
            src={item.images![0] || ""}
            alt={item.name}
            width={200}
            height={200}
            className="object-contain w-auto h-auto" // Add w-auto h-auto
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-center gap-3 py-2">
            <button
              onClick={() => handleQuickView(item)}
              className="w-9 h-9 flex items-center justify-center rounded bg-white text-gray-800  hover:text-blue-600 cursor-pointer"
              aria-label="Quick View"
            >
              <FaEye size={18} />
            </button>
            <button
              onClick={handleAddToCart}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
            >
              <FiShoppingCart size={16} />
              Mua hàng
            </button>
            <button
              onClick={handleAddToWishlist}
              className="w-9 h-9 flex items-center justify-center rounded bg-white text-gray-800  hover:text-red-500 cursor-pointer"
              aria-label="Wishlist"
            >
              <FaHeart size={16} />
            </button>
          </div>
        </div>
        <Rating rating={item.rating!} />
        <h3 className="text-sm font-medium text-gray-900 truncate mt-3">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 mt-3 mb-2 flex items-center gap-2">
          {item.discountPrice ? (
            <>
              <span className="text-red-600 font-semibold">
                {fmt(item.discountPrice)}
              </span>
              <span className="line-through text-gray-400">
                {fmt(item.price)}
              </span>
            </>
          ) : (
            <span className="text-gray-800">{fmt(item.price)}</span>
          )}
        </p>
      </div>
    </>
  );
};

export default ProductItem;
