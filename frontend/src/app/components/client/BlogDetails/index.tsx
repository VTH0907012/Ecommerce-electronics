"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogById } from "@/utils/blogApi";
import { BlogItem } from "@/type/BlogItem";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";
import Image from "next/image";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBlogById(id as string)
        .then((data) => {
          setBlog(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Bài viết không tồn tại
          </h1>
          <Link
            href="/blogs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại trang blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Link
            href="/blogs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách blog
          </Link>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-1.5" />
              <span>
                {new Date(blog.createdAt!).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1.5" />
              <span>{calculateReadTime(blog.content)} phút đọc</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="relative rounded-xl overflow-hidden mb-10 shadow-lg">
          {/* <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto max-h-[500px] object-cover"
          /> */}
          <Image
            src={blog.image}
            alt={blog.title}
            width={800} 
            height={500}
            className="w-full h-auto max-h-[500px] object-cover"
            unoptimized 
          />
        </div>

        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-blue-600 transition border border-gray-200"
          aria-label="Lên đầu trang"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
