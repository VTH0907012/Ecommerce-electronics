import Shop from "@/app/components/client/Shop";
import { getAllBrands } from "@/utils/brandApi";
import { getAllCategorys } from "@/utils/cateApi";
import { getAllProducts } from "@/utils/productApi";

const ProductPage = async () => {
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getAllCategorys(),
    getAllBrands(),
  ]);
  return (
    <main>
        <Shop
        initialProducts={products}
        initialCategories={categories}
        initialBrands={brands}
      />
    </main>
  );
};
export default ProductPage;
