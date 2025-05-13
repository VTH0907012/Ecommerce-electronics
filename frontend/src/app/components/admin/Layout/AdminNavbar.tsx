
"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/redux/userSlice";
import { RootState } from "@/redux";
import { logoutUser } from "@/utils/authApi";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(logout());
      router.push("/login");
    } catch (error: unknown) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setDropdownOpen(false), 500);
    setTimeoutId(id);
  };

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <header
      className={`bg-white shadow-sm sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
            Admin Panel
          </h1>
        </div>

        <div className="relative">
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium text-gray-800">{user.name}</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <span className="text-lg">Tài khoản</span>
          )}

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={closeDropdown}
              >
                Quay lại trang chủ
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
