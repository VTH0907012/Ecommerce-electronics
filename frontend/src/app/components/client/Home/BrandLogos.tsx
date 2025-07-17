"use client";
import React  from "react";
import Image from "next/image";
import useFetchBrands from "@/services/useFetchBrands";

const BrandLogos = () => {
  // const [brands, setBrands] = useState<Brand[]>([]);
  // useEffect(() => {
  //   const fetchBrands = async () => {
  //     try {
  //       const fetchedBrands = await getAllBrands();
  //       setBrands(fetchedBrands);
  //     } catch (err) {
  //       console.error("Lỗi khi lấy dữ liệu thương hiệu:", err);
  //     }
  //   };
  //   fetchBrands();
  // }, []);

  const {brands = []} = useFetchBrands();
  return (
    <section className="py-10 px-4 bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Thương hiệu nổi bật
      </h2>
      <div className="flex justify-center items-center flex-wrap gap-8">
        {brands.map((brand) => (
          <div
            key={brand._id}
            className="relative w-28 h-12" 
          >
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              sizes="112px" 
              className="object-contain  hover:grayscale-0 transition"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandLogos;
