import { Product } from "@/type/Product";
import axiosInstance from "./axiosConfig";


export const getAllProducts = async () => {
    const response = await axiosInstance.get("/products");
    return response.data;
  };
  
  export const getProductById = async (id: string) => {
    const response = await axiosInstance.get(`products/${id}`);
    return response.data;
  };
  
  export const createProduct = async (product: Product) => {
    const response = await axiosInstance.post("products", product);
    return response.data;
  }
  
  export const updateProduct = async (id: string, product: Product) => {
    const response = await axiosInstance.put(`products/${id}`, product);
    return response.data;
  };
  
  export const deleteProduct = async (id: string) => {
    const response = await axiosInstance.delete(`products/${id}`);
    return response.data;
  };