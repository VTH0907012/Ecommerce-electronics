"use client";
import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/utils/productApi";
import { Product } from "@/type/Product";
import ProductItem from "../Shop/ProductItem";
import { motion, AnimatePresence } from "framer-motion";
import { ProductSkeleton } from "../Common/SkeletonLoading";

const FlashSaleSection: React.FC = () => {
  const [flashItems, setFlashItems] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 5;

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        setLoading(true);
        const all = await getAllProducts();
        const filtered = all
          .filter((p: Product) => p.discountPrice)
          .slice(0, limit);
        setFlashItems(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm flash sale:", err);
        setFlashItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  const handleNext = () => {
    if (currentIndex < flashItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-red-600 mb-4 md:mb-0">
            ⚡ Giảm giá cực sốc
          </h2>
        </div>

        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : flashItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Không có sản phẩm giảm giá
            </div>
          ) : (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
              >
                &lt;
              </button>

              <div className="overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
                  >
                    <div className="block md:hidden">
                      <ProductItem item={flashItems[currentIndex]} />
                    </div>
                    
                    {flashItems.slice(0, 4).map((item) => (
                      <div key={item._id} className="hidden md:block">
                        <ProductItem item={item} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex >= flashItems.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
              >
                &gt;
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &lt;
              </button>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(prev + 1, flashItems.length - 1))}
                disabled={currentIndex >= flashItems.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;