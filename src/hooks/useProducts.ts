import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useApiClient, listingApi } from "@/lib/api";

import { FetchListingsParams } from "@/types";

export const useProducts = <T = any>(
  params?: FetchListingsParams,
  options?: Omit<UseQueryOptions<any, Error, T>, 'queryKey' | 'queryFn'>
) => {
  const api = useApiClient();
  
  return useQuery({
    queryKey: ["listings", params],
    queryFn: async () => {
      const response = await listingApi.getListings(api, params);
      return response.data;
    },
    ...options,
  });
};
