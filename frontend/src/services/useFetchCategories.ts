import useSWR from "swr";
import { fetcher } from "./useFetchBlogs";
import { Category } from "@/types/Category";

export default function useFetchCategories() {
  const { data, error, isLoading , mutate} = useSWR<Category[]>(
    "/api/categories",
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    categories: data,
    isLoading,
    isError: error,
    mutate
  };
}
