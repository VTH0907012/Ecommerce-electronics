import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden ">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              Apple iPhone 14 Plus
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              GIẢM GIÁ LÊN ĐẾN 30%
            </h2>

            <p>
              iPhone 14 sử dụng chip A15 Bionic mạnh mẽ giống với iPhone 13 Pro,
              với GPU 5 lõi hỗ trợ mọi tính năng mới nhất.
            </p>

            <Link
              href="/products/6820ce88762a50e6e20d6d6b"
              className="mt-3 inline-block text-sm font-semibold text-white bg-blue-600 px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
            >
              Mua ngay
            </Link>
          </div>

          <Image
            src="/images/promo/promo-01.png"
            alt="Hình ảnh khuyến mãi"
            className="absolute bottom-0 right-4 lg:right-26 -z-1 w-auto h-auto"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-04.png"
              alt="Hình ảnh khuyến mãi"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1 opacity-80 mix-blend-multiply"
              width={241}
              height={241}
            />
            <div className="text-right">
              <span className="block text-lg text-dark mb-1.5">
                Apple iMac M1 24-inch 2021
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Hiệu năng mạnh mẽ
              </h2>

              <p className="font-semibold text-custom-1 text-teal">
                Ưu đãi lên đến 15%
              </p>

              <Link
                href="/products/6820cebc762a50e6e20d6d74"
                className="inline-flex font-medium text-custom-sm text-white bg-green-400 py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
              >
                Mua ngay
              </Link>
            </div>
          </div>

          {/* Banner nhỏ 2 */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-03.png"
              alt="Hình ảnh khuyến mãi"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
                Đồng hồ Apple Watch Ultra
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Giảm đến <span className="text-orange">40%</span>
              </h2>

              <p className="max-w-[285px] text-custom-sm">
                Vỏ titanium chuẩn hàng không mang đến sự cân bằng hoàn hảo về độ
                bền và trọng lượng.
              </p>

              <Link
                href="/products/6820cf09762a50e6e20d6d86"
                className="inline-flex font-medium text-custom-sm text-white bg-orange-600 bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
