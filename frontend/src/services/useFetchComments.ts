import useSWR from "swr";
import { fetcher } from "./useFetchBlogs";
import { Comment } from "@/type/Comment";
import { getAllComments } from "@/utils/commentApi";

export  function useFetchComments() {
  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    "/api/comments",
    getAllComments,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  return {
    comments: data,
    isLoading,
    isError: error,
    mutate,
  };
}
export  function useFetchCommentsByProductId(productId: string) {
  const shouldFetch = !!productId; 

  const { data, error, isLoading, mutate } = useSWR<Comment[]>(
    shouldFetch ? `/api/comments/${productId}` : null,
    fetcher,
    {
      dedupingInterval: 1000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
    return {
    comments: data,
    isLoading,
    isError: error,
    mutate
  };
}
