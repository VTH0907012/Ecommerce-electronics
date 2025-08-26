import useSWR from "swr";
import { fetcher } from "./useFetchBlogs";
import { Product } from "@/types/Product";

export function useFetchProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    "/api/products",
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    products: data,
    isLoading,
    isError: error,
    mutate,
  };
}
export function useFetchProductById(productId: string) {
  const shouldFetch = !!productId;

  const { data, error, isLoading, mutate } = useSWR<Product>(
    shouldFetch ? `/api/products/${productId}` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    product: data,
    isLoading,
    isError: error,
    mutate,
  };
}
export function useFetchRelatedProduct(productId: string) {
  const shouldFetch = !!productId;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    shouldFetch ? `/api/products/related/${productId}` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    product: data,
    isLoading,
    isError: error,
    mutate,
  };
}
