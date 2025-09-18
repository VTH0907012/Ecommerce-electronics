"use client";
import React, {  useRef, useCallback } from "react";

import ProductItem from "../Shop/ProductItem";
//import { ProductSkeleton } from "../Common/SkeletonLoading";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Product } from "@/types/Product";
//import { useFetchProducts } from "@/services/useFetchProduct";

interface ProductFlashSale {
  products: Product[];
}

const FlashSaleSection: React.FC<ProductFlashSale> = ({products}) => {
  //const [flashItems, setFlashItems] = useState<Product[]>([]);
  const sliderRef = useRef<SwiperCore | null>(null);

  //const { products = [], isLoading } = useFetchProducts();
  
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

        {
        // isLoading ? (
        //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        //     {[...Array(4)].map((_, index) => (
        //       <ProductSkeleton key={index} />
        //     ))}
        //   </div>
        // ) : 
        flashItems.length === 0 ? (
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
