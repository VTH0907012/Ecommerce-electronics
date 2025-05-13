import axiosInstance from "./axiosConfig";
import { Category } from "@/type/Category";


export const getAllCategorys= async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  };

  
  export const createCategory = async (Category: Category) => {
    const response = await axiosInstance.post("/categories", Category);
    return response.data;
  }
  
  export const updateCategory = async (id: string, Category: Category) => {
    const response = await axiosInstance.put(`/categories/${id}`, Category);
    return response.data;
  };
  
  export const deleteCategory = async (id: string) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  };
  