import { useQuery } from "@tanstack/react-query";

export const useProducts = (q?: string) => {
  return useQuery({
    queryKey: ["listings", q],
    queryFn: async () => {
      const url = q 
        ? `http://localhost:5000/api/listings?q=${encodeURIComponent(q)}`
        : "http://localhost:5000/api/listings";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
};
