//import { Comment } from "@/type/Comment";
import axiosInstance from "./axiosConfig";


export const createComment = async (productId: string, data: { content: string; rating?: number }) => {
  const res = await fetch(`/api/products/${productId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
    if (!res.ok) throw new Error("Lỗi bình luận");

  return res.json();
};
export const getCommentById = async (productId: string) => {
  const response = await axiosInstance.get(`/api/comments/${productId}`);
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
  return res.json();
};
export const getAllComments = async () => {
  const res = await fetch(`/api/comments`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Lỗi khi lấy tất cả bình luận");
  return res.json();
};