
// import { notFound } from "next/navigation";
// import { getProductById } from "@/utils/productApi";
// import { Product } from "@/type/Product";
// import Breadcrumb from "@/app/components/client/ShopDetails/Breadcrumb";
// import ProductDetailSkeleton from "@/app/components/client/ShopDetails/ProductDetailSkeleton";
// import ProductDetail from "@/app/components/client/ShopDetails/ProductDetail";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// const ProductDetailPage = async ({ params }: PageProps) => {
//   let product: Product | null = null;
//   let loading = true;

//   try {
//     product = await getProductById(params.id);
//     loading = false;
//   } catch (error) {
//     console.error("Failed to fetch product", error);
//     notFound();
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Breadcrumb
//           categoryName={(product?.category as any)?.name}
//           productName={product?.name}
//         />

//         {loading ? (
//           <ProductDetailSkeleton />
//         ) : product ? (
//           <ProductDetail product={product} />
//         ) : (
//           <div className="text-center py-20">Không tìm thấy sản phẩm</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;
import { notFound } from "next/navigation";
import { getProductById } from "@/utils/productApi";
import { Product } from "@/type/Product";
import Breadcrumb from "@/app/components/client/ShopDetails/Breadcrumb";
import ProductDetailSkeleton from "@/app/components/client/ShopDetails/ProductDetailSkeleton";
import ProductDetail from "@/app/components/client/ShopDetails/ProductDetail";

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const ProductDetailPage = async ({ params }: PageProps) => {
  let product: Product | null = null;
  let loading = true;

  try {
    product = await getProductById(params.id);
    loading = false;
  } catch (error) {
    console.error("Failed to fetch product", error);
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          categoryName={(product?.category as any)?.name}
          productName={product?.name}
        />

        {loading ? (
          <ProductDetailSkeleton />
        ) : product ? (
          <ProductDetail product={product} />
        ) : (
          <div className="text-center py-20">Không tìm thấy sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;