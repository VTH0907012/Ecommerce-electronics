import Carousel from "../components/client/Home/Carousel";
import WhyUs from "../components/client/Home/WhyUs";
import ProductSuggestions from "../components/client/Home/ProductSuggestions";
import FlashSaleSection from "../components/client/Home/FlashSaleSection";
import PromoBanner from "../components/client/Home/PromoBanner";
import CategorySection from "../components/client/Home/CategorySection";
import { getAllCategorys } from "@/utils/cateApi";
import { getAllProducts } from "@/utils/productApi";

export default async function HomePage() {
  const categories = await getAllCategorys();
  const products = await getAllProducts();

  return (
    <>
      <main className="min-h-screen bg-white text-gray-900 space-y-6">
        <section className="bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 space-y-4">
            <Carousel />
            <WhyUs />
          </div>
        </section>
        <section className="">
          <div className="max-w-7xl mx-auto px-4">
            <CategorySection categories={categories} />
            <hr className="my-8 border-t border-gray-300" />
          </div>
        </section>
        <section className="">
          <div className="max-w-7xl mx-auto px-4">
            <ProductSuggestions products={products}/>
          </div>
        </section>

        <section className="">
          <div className="max-w-7xl mx-auto px-4">
            <PromoBanner />
            <hr className="my-8 border-t border-gray-300" />
          </div>
        </section>

        <section className="">
          <div className="max-w-7xl mx-auto px-4">
            <FlashSaleSection products={products} />
          </div>
        </section>
      </main>
    </>
  );
}

// import Carousel from "../components/client/Home/Carousel";
// import WhyUs from "../components/client/Home/WhyUs";
// import ProductSuggestions from "../components/client/Home/ProductSuggestions";
// import FlashSaleSection from "../components/client/Home/FlashSaleSection";
// import PromoBanner from "../components/client/Home/PromoBanner";
// import CategorySection from "../components/client/Home/CategorySection";
// import { Suspense } from "react";
// import { LoadingSkeleton } from "../components/client/Common/SkeletonLoading";

// const SectionWrapper = ({
//   children,
//   className = "",
// }: {
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <section className={className}>
//     <div className="max-w-7xl mx-auto px-4">
//       <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
//     </div>
//   </section>
// );

// export default function HomePage() {
//   return (
//     <main className="min-h-screen bg-white text-gray-900">
//       <section className="bg-gray-50 py-6">
//         <div className="max-w-7xl mx-auto px-4 space-y-4">
//           <Carousel />
//           <WhyUs />
//         </div>
//       </section>

//       <SectionWrapper>
//         <CategorySection />
//         <hr className="my-8 border-t border-gray-300" />
//       </SectionWrapper>

//       <SectionWrapper className="py-8 bg-white">
//         <ProductSuggestions />
//       </SectionWrapper>

//       <SectionWrapper>
//         <PromoBanner />
//         <hr className="my-8 border-t border-gray-300" />
//       </SectionWrapper>

//       <SectionWrapper className="py-8">
//         <FlashSaleSection />
//       </SectionWrapper>
//     </main>
//   );
// }
