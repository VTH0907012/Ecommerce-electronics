// "use client";
// import React, { useEffect, useState } from "react";
// import { getAllProducts } from "@/utils/productApi";
// import { Product } from "@/type/Product";
// import ProductItem from "../Shop/ProductItem";
// import { motion, AnimatePresence } from "framer-motion";
// import { ProductSkeleton } from "../Common/SkeletonLoading";

// const FlashSaleSection: React.FC = () => {
//   const [flashItems, setFlashItems] = useState<Product[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const limit = 5;

//   useEffect(() => {
//     const fetchFlashSale = async () => {
//       try {
//         setLoading(true);
//         const all = await getAllProducts();
//         const filtered = all
//           .filter((p: Product) => p.discountPrice)
//           .slice(0, limit);
//         setFlashItems(filtered);
//       } catch (err) {
//         console.error("Lỗi khi lấy sản phẩm flash sale:", err);
//         setFlashItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFlashSale();
//   }, []);

//   const handleNext = () => {
//     if (currentIndex < flashItems.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   return (
//     <section className="py-16 bg-gradient-to-r">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center justify-between mb-8">
//           <h2 className="text-3xl font-extrabold text-red-600 mb-4 md:mb-0">
//             ⚡ Giảm giá cực sốc
//           </h2>
//         </div>

//         <div className="relative">
//           {loading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {[...Array(4)].map((_, index) => (
//                 <ProductSkeleton key={index} />
//               ))}
//             </div>
//           ) : flashItems.length === 0 ? (
//             <div className="text-center py-10 text-gray-500">
//               Không có sản phẩm giảm giá
//             </div>
//           ) : (
//             <>
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
//                       <ProductItem item={flashItems[currentIndex]} />
//                     </div>

//                     {/* Tablet/Desktop: Hiện tối đa 4 sản phẩm (tùy breakpoint) */}

//                     {flashItems
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
//                 disabled={currentIndex >= flashItems.length - 1}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 border border-gray-300 bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed md:hidden"
//               >
//                 &gt;
//               </button>

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
//                     Math.min(prev + 1, flashItems.length - 1)
//                   )
//                 }
//                 disabled={currentIndex >= flashItems.length - 4}
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
// export default FlashSaleSection;
"use client";
import React, {  useRef, useCallback } from "react";

import ProductItem from "../Shop/ProductItem";
import { ProductSkeleton } from "../Common/SkeletonLoading";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useFetchProducts } from "@/services/useFetchProduct";

const FlashSaleSection: React.FC = () => {
  //const [flashItems, setFlashItems] = useState<Product[]>([]);
  const sliderRef = useRef<SwiperCore | null>(null);

  const { products = [], isLoading } = useFetchProducts();
  const flashItems = products.filter((p) => p.discountPrice).slice(0, 6);
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   const fetchFlashSale = async () => {
  //     try {
  //       setIsLoading(true);
  //       const all = await getAllProducts();
  //       const filtered = all
  //         .filter((p: Product) => p.discountPrice)
  //         .slice(0, 10);
  //       setFlashItems(filtered);
  //     } catch (err) {
  //       console.error("Lỗi khi lấy sản phẩm flash sale:", err);
  //       setFlashItems([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchFlashSale();
  // }, []);

  const handlePrev = useCallback(() => {
    sliderRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.slideNext();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-red-600 mb-4 md:mb-0">
            ⚡ Giảm giá cực sốc
          </h2>
        </div>

        {isLoading ? (
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
              {flashItems.map((item) => (
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

export default FlashSaleSection;
