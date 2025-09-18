import axiosInstance from "./axiosConfig";
import { Brand } from "@/types/Brand";


// export const getAllBrands= async () => {
//     const response = await axiosInstance.get("/api/brands");
//     return response.data;
//   };

export async function getAllBrands() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
}


  
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