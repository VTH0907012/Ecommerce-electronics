"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/type/Product";
import Rating from "@/app/components/client/Rating";
import { fmt } from "@/utils/fmt";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux";
import { addToCart } from "@/redux/cartSlice";
import { getProductById, getRelatedProducts } from "@/utils/productApi";
import { useParams } from "next/navigation";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import Breadcrumb from "./Breadcrumb";
import { motion } from "framer-motion";
import ProductItem from "../Shop/ProductItem";
import CommentSection from "./CommentSection";

const ProductDetail = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id as string);
        setProduct(productData);

        // Fetch related products
        setLoadingRelated(true);
        const related = await getRelatedProducts(id as string);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
        setLoadingRelated(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch<AppDispatch>();

  const handleQuantityChange = (value: number) => {
    const newValue = quantity + value;
    if (newValue > 0 && newValue <= (product?.quantity || 1)) {
      setQuantity(newValue);
    }
  };

  const handleAddToCart = (item: Product) => {
    dispatch(addToCart({ ...item, quantityToBuy: quantity }));
  };

  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  return (
    <>
      <Breadcrumb
        categoryName={(product?.category as any)?.name}
        productName={product?.name}
      />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="w-full md:w-1/2">
          <div className="sticky top-4">
            <div className="relative aspect-square w-full rounded-xl bg-white shadow-sm overflow-hidden mb-4 border border-gray-200">
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {(product.category as any)?.name || "Không phân loại"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center mb-4">
              {product.rating && (
                <>
                  <Rating rating={product.rating} />
                  <span className="ml-2 text-sm text-gray-500">
                    ({product.rating.toFixed(1)} đánh giá)
                  </span>
                </>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span
                  className={`text-3xl font-bold ${
                    product.discountPrice ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {fmt(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {fmt(product.price)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Giảm{" "}
                      {Math.round(
                        (1 - product.discountPrice / product.price) * 100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
              <p
                className={`text-sm mt-1 ${
                  product.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.quantity > 0
                  ? `Còn ${product.quantity} sản phẩm`
                  : "Hết hàng"}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Mô tả sản phẩm
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description || "Sản phẩm chưa có mô tả chi tiết."}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Thương hiệu
              </h2>
              <p className="text-gray-700">
                {(product.brand as any)?.name ||
                  "Không có thông tin thương hiệu"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                >
                  -
                </button>
                <span className="px-4 py-2 w-12 text-center border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={product.quantity === 0}
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Yêu thích
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin chi tiết
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Danh mục</h3>
                <p className="text-gray-900">
                  {(product.category as any)?.name || "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Thương hiệu
                </h3>
                <p className="text-gray-900">
                  {(product.brand as any)?.name || "-"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Tình trạng
                </h3>
                <p className="text-gray-900">
                  {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Mã sản phẩm
                </h3>
                <p className="text-gray-900">{product._id?.slice(-8) || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-16 border-gray-300" />

      <CommentSection productId={id as string} />

      {/* Phần sản phẩm liên quan */}
      <hr className="mt-16 border-gray-300" />
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Sản phẩm liên quan
          </h2>

          {loadingRelated ? (
            <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 gap-6">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-4 h-full"
                >
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-md mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {relatedProducts.map((product) => (
                <ProductItem key={product._id} item={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Hiện không có sản phẩm liên quan
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
