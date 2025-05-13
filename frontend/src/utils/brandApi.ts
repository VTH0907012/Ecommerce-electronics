import axiosInstance from "./axiosConfig";
import { Brand } from "@/type/Brand";


export const getAllBrands= async () => {
    const response = await axiosInstance.get("/api/brands");
    return response.data;
  };

  
  export const createBrand = async (brand: Brand) => {
    const response = await axiosInstance.post("/api/brands", brand);
    return response.data;
  }
  
  export const updateBrand = async (id: string, brand: Brand) => {
    const response = await axiosInstance.put(`/api/brands/${id}`, brand);
    return response.data;
  };
  
  export const deleteBrand = async (id: string) => {
    const response = await axiosInstance.delete(`/api/brands/${id}`);
    return response.data;
  };