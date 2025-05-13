import axiosInstance from "./axiosConfig";
import { Brand } from "@/type/Brand";


export const getAllBrands= async () => {
    const response = await axiosInstance.get("/brands");
    return response.data;
  };

  
  export const createBrand = async (brand: Brand) => {
    const response = await axiosInstance.post("/brands", brand);
    return response.data;
  }
  
  export const updateBrand = async (id: string, brand: Brand) => {
    const response = await axiosInstance.put(`/brands/${id}`, brand);
    return response.data;
  };
  
  export const deleteBrand = async (id: string) => {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  };