import {  BlogItem } from "@/types/BlogItem";
// import axiosInstance from "./axiosConfig";

// export async function getAllBlogs() {
//   const response = await axiosInstance.get("/api/blogs");
//   return response.data;
// }
export async function getAllBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}


// export async function getBlogById(id: string){
//   const response = await axiosInstance.get(`/api/blogs/${id}`);
//   return response.data;
// }

export async function getBlogById(id: string){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
}

export async function createBlog(blog: BlogItem) {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Lỗi khi tạo blog");
  return await res.json();
}

export async function updateBlog(id: string, blog: BlogItem) {
  const res = await fetch(`/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Lỗi khi cập nhật blog");
  return await res.json();
}

export async function deleteBlog(id: string) {
  const res = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Lỗi khi xóa blog");
  return await res.json();
}
