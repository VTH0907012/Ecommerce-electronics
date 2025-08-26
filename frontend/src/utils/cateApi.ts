import axiosInstance from "./axiosConfig";
import { Category } from "@/types/Category";


export const getAllCategorys= async () => {
    const response = await axiosInstance.get("/api/categories");
    return response.data;
  };

  
  export const createCategory = async (Category: Category) => {
    const response = await axiosInstance.post("/api/categories", Category);
    return response.data;
  }
  
  export const updateCategory = async (id: string, Category: Category) => {
    const response = await axiosInstance.put(`/api/categories/${id}`, Category);
    return response.data;
  };
  
  export const deleteCategory = async (id: string) => {
    const response = await axiosInstance.delete(`/api/categories/${id}`);
    return response.data;
  };
  