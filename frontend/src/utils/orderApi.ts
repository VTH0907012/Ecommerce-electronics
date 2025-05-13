import { Order } from "@/type/Order";
import axiosInstance from "./axiosConfig";


export const createOrder = async (orderData: Omit<Order, "_id" | "createdAt" | "status">) => {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
  };
  
  export const updateOrderStatus = async (orderId: string, status: "pending" | "shipped" | "delivered" | "cancelled") => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
    return response.data;
  };
  
  export const cancelOrder = async (orderId: string) => {
    const response = await axiosInstance.put(`/orders/${orderId}/cancel`);
    return response.data;
  };
  
  export const getAllOrders = async () => {
    const response = await axiosInstance.get("/orders/all");
    return response.data; 
  };
  
  export const getOrdersByUser = async (userId: string) => {
    const response = await axiosInstance.get(`/orders/user/${userId}`);
    return response.data;
  };
  
  export const getRevenueByMonth = async () => {
    const response = await axiosInstance.get("/orders/revenue-by-month");
    return response.data;
  };