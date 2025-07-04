"use client";
import { useEffect, useState } from "react";
import { getAllBlogs } from "@/utils/blogApi";
import { BlogItem } from "@/type/BlogItem";
import Link from "next/link";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import Image from "next/image";

const ITEMS_PER_PAGE = 6;

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBlogs();
        const publishedBlogs = data.filter(
          (blog: BlogItem) => blog.isPublished
        );
        setBlogs(publishedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      {/* <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tin Tức & Bài Viết
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá những bài viết mới nhất và thông tin hữu ích từ chúng tôi
        </p>
      </div> */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {" "}
          Tin Tức & Bài Viết
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá những bài viết mới nhất và thông tin hữu ích từ chúng tôi
        </p>
      </div>
      <hr className="max-w-md mx-auto my-8 border-t-2 border-gray-300 rounded-full shadow-sm" />

      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
              {paginatedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="group"
                >
                  <div className="h-full bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300 flex flex-col">
                    <div className="relative overflow-hidden h-56">
                      {/* <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      /> */}
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={500} 
                        height={300}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {blog.content.slice(0, 150)}...
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1.5" />
                          <span>{formatDate(blog.createdAt!)}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-1.5" />
                          <span>
                            {calculateReadTime(blog.content)} phút đọc
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, blogs.length)} trên{" "}
                  {blogs.length} bài viết
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1
                        ? "text-gray-300 border-gray-200 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages
                        ? "text-gray-300 border-gray-200 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có bài viết nào
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Hiện tại không có bài viết nào được đăng tải. Vui lòng quay lại
              sau!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
