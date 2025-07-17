import useSWR from "swr";
import { Brand } from "@/type/Brand";
import { fetcher } from "./useFetchBlogs";

export default function useFetchBrands() {
  const { data, error, isLoading, mutate } = useSWR<Brand[]>("/api/brands", fetcher, {
    dedupingInterval: 1000,
    revalidateOnFocus: false, 
    revalidateIfStale: false,
  });

  return {
    brands: data,
    isLoading,
    isError: error,
    mutate
  };
}
