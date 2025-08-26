import useSWR from "swr";
import { fetcher } from "./useFetchBlogs";
import { User } from "@/types/User";

export default function useFetchUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("/api/users", fetcher, {
    dedupingInterval: 1000,
    revalidateOnFocus: false, 
    revalidateIfStale: false,
  });

  return {
    users: data,
    isLoading,
    isError: error,
    mutate
  };
}
