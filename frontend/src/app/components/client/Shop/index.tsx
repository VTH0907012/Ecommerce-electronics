"use client";
import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { Category } from "@/type/Category";
import { Brand } from "@/type/Brand";
import { getAllProducts } from "@/utils/productApi";
import { getAllCategorys } from "@/utils/cateApi";
import { getAllBrands } from "@/utils/brandApi";
import { Product } from "@/type/Product";
import ProductItem from "./ProductItem";
import { useSearchParams } from "next/navigation";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // State for filters
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Get category from URL
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productData, categoryData, brandData] = await Promise.all([
          getAllProducts(),
          getAllCategorys(),
          getAllBrands(),
        ]);
        setProducts(productData);
        setCategories(categoryData);
        setBrands(brandData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        search &&
        !product.name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      if (priceFilter === "low" && product.price > 10_000_000) return false;
      if (
        priceFilter === "mid" &&
        (product.price < 10_000_000 || product.price > 20_000_000)
      ) {
        return false;
      }
      if (priceFilter === "high" && product.price <= 20_000_000) return false;

      if (categoryFilter && (product.category as any)?._id !== categoryFilter) {
        return false;
      }

      if (brandFilter && (product.brand as any)?._id !== brandFilter) {
        return false;
      }

      return true;
    });
  }, [products, search, priceFilter, categoryFilter, brandFilter]);

  // Pagination logic
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setPriceFilter("");
    setCategoryFilter("");
    setBrandFilter("");
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const activeFiltersCount = [
    search,
    priceFilter,
    categoryFilter,
    brandFilter,
  ].filter(Boolean).length;

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-gradient-to-r  py-12 px-4 sm:px-6 lg:px-8  mx-auto">
        <div className=" text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
            <span className="block">Khám phá sản phẩm</span>
            <span className="block text-blue-600">Của chúng tôi</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Chất lượng tốt nhất - Giá cả hợp lý - Dịch vụ tận tâm
          </p>
        </div>
      </div>
      <hr className="max-w-7xl mx-auto my-8 border-t-2 border-gray-300 rounded-full " />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter dialog */}
        <div className="md:hidden mb-4">
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FiFilter className="mr-2" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0  overflow-y-auto  bg-gray-500 bg-opacity-75 transition-opacity z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-xs mx-auto p-4">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
                <button
                  type="button"
                  className="-mr-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu
                  </label>
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={brandFilter}
                    onChange={(e) => {
                      setBrandFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức giá
                  </label>
                  <select
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={priceFilter}
                    onChange={(e) => {
                      setPriceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Tất cả mức giá</option>
                    <option value="low">Dưới 10 triệu</option>
                    <option value="mid">10–20 triệu</option>
                    <option value="high">Trên 20 triệu</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Xóa bộ lọc
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - Desktop */}
          <div className="hidden md:block w-64 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Tìm kiếm</h3>
              <div className="relative">
                <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Danh mục</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category._id} className="flex items-center">
                    <input
                      id={`category-${category._id}`}
                      name="category"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={categoryFilter === category._id}
                      onChange={() => {
                        setCategoryFilter(category._id!);
                        setCurrentPage(1);
                      }}
                    />
                    <label
                      htmlFor={`category-${category._id}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Thương hiệu</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand._id} className="flex items-center">
                    <input
                      id={`brand-${brand._id}`}
                      name="brand"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={brandFilter === brand._id}
                      onChange={() => {
                        setBrandFilter(brand._id!);
                        setCurrentPage(1);
                      }}
                    />
                    <label
                      htmlFor={`brand-${brand._id}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Mức giá</h3>
              <div className="space-y-2">
                {[
                  { id: "low", label: "Dưới 10 triệu" },
                  { id: "mid", label: "10–20 triệu" },
                  { id: "high", label: "Trên 20 triệu" },
                ].map((price) => (
                  <div key={price.id} className="flex items-center">
                    <input
                      id={`price-${price.id}`}
                      name="price"
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={priceFilter === price.id}
                      onChange={() => {
                        setPriceFilter(price.id);
                        setCurrentPage(1);
                      }}
                    />
                    <label
                      htmlFor={`price-${price.id}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {price.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {(search || priceFilter || categoryFilter || brandFilter) && (
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(search || priceFilter || categoryFilter || brandFilter) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg ">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Bộ lọc:
                  </span>

                  {search && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700  ">
                      Tìm kiếm: {search}
                      <button
                        onClick={() => setSearch("")}
                        className="ml-1.5 inline-flex text-gray-400 focus:outline-none"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {categoryFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700">
                      Danh mục:{" "}
                      {categories.find((c) => c._id === categoryFilter)?.name}
                      <button
                        onClick={() => setCategoryFilter("")}
                        className="ml-1.5 inline-flex text-gray-400 focus:outline-none"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {brandFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700">
                      Thương hiệu:{" "}
                      {brands.find((b) => b._id === brandFilter)?.name}
                      <button
                        onClick={() => setBrandFilter("")}
                        className="ml-1.5 inline-flex text-gray-400 focus:outline-none"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {priceFilter && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700">
                      Giá:{" "}
                      {priceFilter === "low"
                        ? "Dưới 10 triệu"
                        : priceFilter === "mid"
                        ? "10–20 triệu"
                        : "Trên 20 triệu"}
                      <button
                        onClick={() => setPriceFilter("")}
                        className="ml-1.5 inline-flex text-gray-400 focus:outline-none"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Display */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array.from({ length: productsPerPage }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 bg-gray-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : totalProducts === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Vui lòng thử lại với bộ lọc khác hoặc từ khóa tìm kiếm khác
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              // <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              //   {paginatedProducts.map((product) => (
              //     <ProductItem key={product._id} item={product} />
              //   ))}
              // </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductItem key={product._id} item={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalProducts > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * productsPerPage + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * productsPerPage, totalProducts)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{totalProducts}</span> sản phẩm
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-3 py-1 text-sm text-gray-500">...</span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
