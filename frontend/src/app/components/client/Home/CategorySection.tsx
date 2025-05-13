
"use client";
import React, { useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperCore } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Category } from "@/type/Category";
import { getAllCategorys } from "@/utils/cateApi";
import { FaTags } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CategorySkeleton } from "../Common/SkeletonLoading";

const CategorySection: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true); 
  const sliderRef = useRef<SwiperCore | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategorys();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handlePrev = useCallback(() => {
    sliderRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    sliderRef.current?.slideNext();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  return (
    <div className="relative px-4 mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-1xl md:text-3xl font-bold text-gray-600 flex">
            <FaTags className="mr-3" /> Danh mục
          </h4>
        </div>
      </div>

      <div className="relative mt-5">
        {loading ? (
          <div className="flex gap-4">
            {[...Array(6)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Hiện tại chưa có danh mục
          </div>
        ) : (
          <>
            <Swiper
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
              }}
              onSwiper={(swiper) => {
                sliderRef.current = swiper;
              }}
              modules={[Autoplay]}
              autoplay={{ delay: 2000 }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category._id}>
                  <div 
                    className="flex flex-col items-center space-y-2 cursor-pointer"
                    onClick={() => handleCategoryClick(category._id!)}
                  >
                    <div className="w-24 h-24 rounded-full bg-[#f5f7fc] flex items-center justify-center">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-[#1e1e1e] text-center">
                      {category.name}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10 cursor-pointer" 
              onClick={handlePrev}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10 cursor-pointer"
              onClick={handleNext}
            >
              <IoIosArrowForward />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default CategorySection;