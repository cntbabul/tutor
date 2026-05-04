import { useQuery } from "@tanstack/react-query";
import { useApiClient, listingApi } from "@/lib/api";

export const useProducts = (q?: string) => {
  const api = useApiClient();
  
  return useQuery({
    queryKey: ["listings", q],
    queryFn: async () => {
      const response = await listingApi.getListings(api, q);
      return response.data;
    },
  });
};
