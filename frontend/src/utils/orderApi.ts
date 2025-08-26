import { Order, OrderStatus } from "@/types/Order";
import axiosInstance from "./axiosConfig";


export const createOrder = async (orderData: Omit<Order, "_id" | "createdAt" | "status">) => {
    const response = await axiosInstance.post("/api/orders", orderData);
    return response.data;
  };
  
  export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const response = await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
    return response.data;
  };
  
  export const cancelOrder = async (orderId: string) => {
    const response = await axiosInstance.put(`/api/orders/${orderId}/cancel`);
    return response.data;
  };
  
  export const getAllOrders = async () => {
    const response = await axiosInstance.get("/api/orders/all");
    return response.data; 
  };
  
  export const getOrdersByUser = async (userId: string) => {
    const response = await axiosInstance.get(`/api/orders/user/${userId}`);
    return response.data;
  };
  
  export const getRevenueByMonth = async () => {
    const response = await axiosInstance.get("/api/orders/revenue-by-month");
    return response.data;
  };

    export const createVnpayPayment = async (body : any) => {
    const response = await axiosInstance.post("/api/orders/creat-payment-vnpay",body);
    return response.data;
  };
    export const createOrderTemp = async (body : any) => {
    const response = await axiosInstance.post("/api/orders/temp",body);
    return response.data;
  };
    
  export const getOrderdetails = async (orderId: any) => {
    const response = await axiosInstance.get(`/api/orders/${orderId}/details`);
    return response.data;
  };
  