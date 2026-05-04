import { useQuery } from "@tanstack/react-query";
import { useApiClient, listingApi } from "@/lib/api";

export const useListing = (id: string) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const response = await listingApi.getListing(api, id);
      return response.data;
    },
    enabled: !!id,
  });
};
