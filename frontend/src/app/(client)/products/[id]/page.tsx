import ProductDetail from "@/app/components/client/ShopDetails/ProductDetail";
import { getProductById, getRelatedProducts } from "@/utils/productApi";

// const ProductDetailPage = () => {
//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <ProductDetail />
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  const product = await getProductById(id);
  const related = await getRelatedProducts(id);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} relatedProducts={related} />
      </div>
    </div>
  );
}
