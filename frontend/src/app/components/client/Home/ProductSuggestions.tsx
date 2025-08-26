// "use client";
// import React, { useEffect, useState } from "react";
// import { Product } from "@/type/Product";
// import { motion, AnimatePresence } from "framer-motion";
// import { getAllProducts } from "@/utils/productApi";
// import ProductItem from "../Shop/ProductItem";
// import { FaBarsStaggered } from "react-icons/fa6";
// import { useRouter } from "next/navigation";
// import { ProductSkeleton } from "../Common/SkeletonLoading";

// const ProductSuggestions: React.FC = () => {
//   const [topProducts, setTopProducts] = useState<Product[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         const products = await getAllProducts();

//         const filtered = products
//           .filter((p: Product) => p.rating! > 0)
//           .sort((a: any, b: any) => b.rating! - a.rating!)
//           .slice(0, 10);

//         setTopProducts(filtered);
//         console.log(filtered);
//       } catch (error) {
//         console.error("Lỗi khi tải sản phẩm:", error);
//         setTopProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleNext = () => {
//     if (currentIndex < topProducts.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   return (
//     <section className="py-16 bg-white relative">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h4 className="text-1xl md:text-3xl font-bold text-gray-600 flex">
//               <FaBarsStaggered className="mr-3" /> Gợi ý sản phẩm
//             </h4>
//           </div>
//           <button
//             onClick={() => router.push("/products")}
//             className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
//           >
//             Xem tất cả
//           </button>
//         </div>

//         <div className="relative">
//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {[...Array(4)].map((_, index) => (
//                 <ProductSkeleton key={index} />
//               ))}
//             </div>
//           ) : topProducts.length === 0 ? (
//             <div className="text-center py-10 text-gray-500">
//               Không có sản phẩm gợi ý nào
//             </div>
//           ) : (
//             <>
//               {/* Mobile navigation buttons */}
//               <button
//                 onClick={handlePrev}
//                 disabled={currentIndex === 0}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
//               >
//                 &lt;
//               </button>
//               <div className="overflow-hidden relative">
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={currentIndex}
//                     initial={{ opacity: 0, x: 100 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -100 }}
//                     transition={{ duration: 0.4 }}
//                     className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
//                   >
//                     {/* Mobile: Chỉ hiện 1 sản phẩm */}
//                     <div className="block sm:hidden">
//                       <ProductItem item={topProducts[currentIndex]} />
//                     </div>

//                     {/* Tablet/Desktop: Hiện tối đa 4 sản phẩm (tùy breakpoint) */}
//                     {topProducts
//                       .slice(currentIndex, currentIndex + 4)
//                       .map((item, index) => (
//                         <div
//                           key={item._id}
//                           className={`hidden ${
//                             index < 2 ? "sm:block" : "md:block" // Từ sm hiện 2 sp, từ md hiện 4 sp
//                           }`}
//                         >
//                           <ProductItem item={item} />
//                         </div>
//                       ))}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>

//               <button
//                 onClick={handleNext}
//                 disabled={currentIndex >= topProducts.length - 1}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
//               >
//                 &gt;
//               </button>

//               {/* Desktop navigation buttons */}
//               <button
//                 onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
//                 disabled={currentIndex === 0}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 &lt;
//               </button>
//               <button
//                 onClick={() =>
//                   setCurrentIndex((prev) =>
//                     Math.min(prev + 1, topProducts.length - 1)
//                   )
//                 }
//                 disabled={currentIndex >= topProducts.length - 4}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
//               >
//                 &gt;
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };
// export default ProductSuggestions;

"use client";
import React, {  useRef, useCallback } from "react";
import { Product } from "@/types/Product";
import ProductItem from "../Shop/ProductItem";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { ProductSkeleton } from "../Common/SkeletonLoading";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import { useFetchProducts } from "@/services/useFetchProduct";

const ProductSuggestions: React.FC = () => {
  const sliderRef = useRef<SwiperCore | null>(null);
  const router = useRouter();

  const { products = [], isLoading } = useFetchProducts();
  const topProducts = products
    .filter((p: Product) => p.rating! > 0)
    .sort((a: any, b: any) => b.rating! - a.rating!)
    .slice(0, 6);
  // const [topProducts, setTopProducts] = useState<Product[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setIsLoading(true);
  //       const products = await getAllProducts();
  //       const filtered = products
  //         .filter((p: Product) => p.rating! > 0)
  //         .sort((a: any, b:any) => b.rating! - a.rating!)
  //         .slice(0, 10);
  //       setTopProducts(filtered);
  //     } catch (error) {
  //       console.error("Lỗi khi tải sản phẩm:", error);
  //       setTopProducts([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  const handlePrev = useCallback(() => {
    sliderRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.slideNext();
  }, []);

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-1xl md:text-3xl font-bold text-gray-600 flex items-center">
            <FaBarsStaggered className="mr-3" /> Gợi ý sản phẩm
          </h4>
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-blue-600 hover:text-white transition"
          >
            Xem tất cả
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Không có sản phẩm gợi ý nào
          </div>
        ) : (
          <div className="relative">
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 4 },
              }}
              onSwiper={(swiper) => {
                sliderRef.current = swiper;
              }}
            >
              {topProducts.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="h-full">
                    <ProductItem item={item} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10 cursor-pointer transition-transform hover:scale-110"
              onClick={handlePrev}
            >
              <IoIosArrowBack className="text-gray-600" />
            </button>
            <button
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10 cursor-pointer transition-transform hover:scale-110"
              onClick={handleNext}
            >
              <IoIosArrowForward className="text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSuggestions;
