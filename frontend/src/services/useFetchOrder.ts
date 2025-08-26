import useSWR from "swr";
import { fetcher } from "./useFetchBlogs";
import { Order } from "@/types/Order";

export  function useFetchOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/api/orders/all",
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
}
export  function useFetchOrdersByUser(userId: string) {
  const shouldFetch = !!userId; 

  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    shouldFetch ? `/api/orders/user/${userId}` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
    return {
    orders: data,
    isLoading,
    isError: error,
    mutate
  };
}
export  function useFetchOrdersById(orderId: string) {
  const shouldFetch = !!orderId; 

  const { data, error, isLoading, mutate } = useSWR<Order>(
    shouldFetch ? `/api/orders/${orderId}/details` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
    return {
    order: data,
    isLoading,
    isError: error,
    mutate
  };
}