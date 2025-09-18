import { Product } from "@/types/Product";
import axiosInstance from "./axiosConfig";

// export const getAllProducts = async () => {
//   const response = await axiosInstance.get("/api/products");
//   return response.data;
// };
export async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch products ");
  return res.json();
}

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Product) => {
  const response = await axiosInstance.post("/api/products", product);
  return response.data;
};

export const updateProduct = async (id: string, product: Product) => {
  const response = await axiosInstance.put(`/api/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};
export const getRelatedProducts = async (id: string) => {
  const res = await axiosInstance(`/api/products/related/${id}`);
  return res.data;
};
