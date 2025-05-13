
"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  FiHome,
  FiBox,
  FiTag,
  FiShoppingCart,
  FiFileText,
  FiUser,
  FiX,
} from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50  z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 space-y-6 shadow-md transform transition-transform duration-300 ease-in-out z-50 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-bold">Admin Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-800"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-base mt-8">
            <NavLink href="/admin" icon={<FiHome />}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/categories" icon={<FiBox />}>
              Danh mục
            </NavLink>
            <NavLink href="/admin/brands" icon={<FiTag />}>
              Nhãn hiệu
            </NavLink>
            <NavLink href="/admin/products" icon={<FiShoppingCart />}>
              Sản phẩm
            </NavLink>
            <NavLink href="/admin/orders" icon={<FiFileText />}>
              Hoá đơn
            </NavLink>
            <NavLink href="/admin/blogs" icon={<FiFileText />}>
              Blog
            </NavLink>
            <NavLink href="/admin/users" icon={<FiUser />}>
              Người dùng
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 bg-gray-50 overflow-y-auto transition-all duration-300 ml-0 ">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 hover:text-blue-400"
    >
      <span className="text-2xl transition-transform hover:scale-125 hover:text-blue-400">
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}
