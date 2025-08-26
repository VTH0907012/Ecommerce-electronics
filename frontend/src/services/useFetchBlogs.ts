import useSWR from "swr";
import axiosInstance from "@/utils/axiosConfig";
import { BlogItem } from "@/types/BlogItem";

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export  function useFetchBlogs() {
  const { data, error, isLoading, mutate  } = useSWR<BlogItem[]>("/api/blogs", fetcher, {
    dedupingInterval: 1000,
    revalidateOnFocus: false, 
    revalidateIfStale: false,
  });

  return {
    blogs: data,
    isLoading,
    isError: error,
    mutate,
  };
}
export  function useFetchBlogById(blogId: string) {
  const shouldFetch = !!blogId; 

  const { data, error, isLoading, mutate } = useSWR<BlogItem>(
    shouldFetch ? `/api/blogs/${blogId}` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
    return {
    blog: data,
    isLoading,
    isError: error,
    mutate
  };
}