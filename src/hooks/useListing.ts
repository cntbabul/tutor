import { useQuery } from "@tanstack/react-query";

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/listings/${id}`);
      if (!response.ok) {
        throw new Error("Listing not found");
      }
      return response.json();
    },
    enabled: !!id,
  });
};
