"use client";
import Link from "next/link";
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { logoutUser } from "@/utils/authApi";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/index";
import { logout } from "../../../../redux/userSlice";
import { toggleCart } from "@/redux/cartSlice";
import { FaChevronDown } from "react-icons/fa";
import { Product } from "@/type/Product";
import { getAllProducts } from "@/utils/productApi";
import { fmt } from "@/utils/fmt";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      setDropdownOpen(false);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchVisible) setIsSearchVisible(false);
    setShowSuggestions(false);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    if (!isSearchVisible) {
      setSearchQuery("");
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchVisible(false);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/products/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
    setIsSearchVisible(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="bg-gray-700 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
          <span>Miễn phí vận chuyển đơn hàng từ 1.000.000₫</span>
        </div>
      </div>

      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`flex items-center justify-between h-16 ${
              isScrolled ? "py-0" : "py-2"
            }`}
          >
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo/logo.png"
                alt="Logo"
                width={100}
                height={40}
                className="w-auto h-10"
              />{" "}
              <span className="ml-2 text-2xl font-bold text-blue-600 hidden sm:block">
                A$HOP
              </span>
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex mx-4 flex-1 max-w-2xl relative"
            >
              <div className="relative w-full" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    searchQuery.length > 0 && setShowSuggestions(true)
                  }
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <FiSearch className="h-5 w-5" />
                </button>

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() =>
                            product._id && handleProductSelect(product._id)
                          }
                        >
                          {product.images && product.images.length > 0 && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="object-cover mr-3 rounded"
                              unoptimized
                            />
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-600">
                              {fmt(product.price)}
                              {product.discountPrice && (
                                <span className="ml-2 text-xs text-red-500 line-through">
                                  {fmt(product.discountPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      searchQuery.length > 0 && (
                        <div className="px-4 py-2 text-gray-500">
                          Không tìm thấy sản phẩm phù hợp
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={toggleSearch}
                className="md:hidden text-gray-700 hover:text-blue-600 p-2"
                aria-label="Search"
              >
                <FiSearch className="h-5 w-5" />
              </button>

              <div className="hidden md:block text-xs text-right leading-4">
                <div className="text-gray-400 font-bold">24/7 SUPPORT</div>
                <div className="text-blue-700 font-bold">(+84) 2812345678</div>
              </div>

              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 group"
                  >
                    <div className="relative">
                      <FiUser className="h-5 w-5 group-hover:stroke-blue-600" />
                    </div>
                    <span className="flex items-center">
                      {user.name.split(" ")[1]}{" "}
                      <FaChevronDown
                        className={`ml-1 text-xs transition ${
                          isDropdownOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Tài khoản của tôi
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Trang quản trị
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex flex-col items-center text-xs text-gray-700 hover:text-blue-600"
                >
                  <FiUser className="h-5 w-5" />
                  <span>Đăng nhập</span>
                </Link>
              )}

              <button
                onClick={handleCartClick}
                className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 relative group cursor-pointer"
              >
                <div className="relative">
                  <FiShoppingCart className="h-5 w-5 group-hover:stroke-blue-600 " />
                  {cartItems.length > 0 && (
                    <span className=" absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span>Giỏ hàng</span>
              </button>

              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-700 hover:text-blue-600 p-2 ml-2"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isSearchVisible && (
            <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    searchQuery.length > 0 && setShowSuggestions(true)
                  }
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <FiSearch className="h-5 w-5" />
                </button>

                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() =>
                            product._id && handleProductSelect(product._id)
                          }
                        >
                          {product.images && product.images.length > 0 && (
<Image
  src={product.images[0]}
  alt={product.name}
  width={32} 
  height={32} 
  className="object-cover mr-3 rounded"
/>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-600">
                              {fmt(product.price)}

                              {product.discountPrice && (
                                <span className="ml-2 text-xs text-red-500 line-through">
                                  {fmt(product.discountPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      searchQuery.length > 0 && (
                        <div className="px-4 py-2 text-gray-500">
                          Không tìm thấy sản phẩm phù hợp
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-8 py-3">
              <Link
                href="/"
                className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition"
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition"
              >
                Sản phẩm
              </Link>
              <Link
                href="/blogs"
                className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition"
              >
                Bài viết
              </Link>
              <Link
                href="/about"
                className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition"
              >
                Về chúng tôi
              </Link>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-blue-600 font-medium px-3 py-2 transition"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                onClick={toggleMobileMenu}
              >
                Sản phẩm
              </Link>
              <Link
                href="/blogs"
                className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                onClick={toggleMobileMenu}
              >
                Bài viết
              </Link>
              <Link
                href="/wishlist"
                className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                onClick={toggleMobileMenu}
              >
                Yêu thích
              </Link>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Tài khoản
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                      onClick={toggleMobileMenu}
                    >
                      Trang quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-gray-800 hover:bg-gray-50 rounded-md font-medium"
                    onClick={toggleMobileMenu}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
