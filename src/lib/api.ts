import { useAuth } from "@clerk/nextjs";
import axios, { AxiosInstance } from "axios";
import { API_URL } from "./constants";

// This creates an authenticated API client
export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
    const api = axios.create({
        baseURL: API_URL
    });

    api.interceptors.request.use(async (config) => {
        // Fetch the JWT token from Clerk
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Keep our current x-user-id for backward compatibility with the backend
        // We'll extract the user ID from the context if possible, 
        // but for now, we'll continue to pass it manually where needed 
        // until we update the backend to verify JWTs.
        
        return config;
    });

    return api;
};

// Hook to use the API client in Client Components
export const useApiClient = (): AxiosInstance => {
    const { getToken } = useAuth();
    return createApiClient(getToken);
};

// API Resource Definitions
export const userApi = {
    getProfile: (api: AxiosInstance, userId: string) => 
        api.get("/api/users/profile", { headers: { "x-user-id": userId } }),
    updateProfile: (api: AxiosInstance, userId: string, data: any) => 
        api.post("/api/users/profile", data, { headers: { "x-user-id": userId } }),
};

export const listingApi = {
    getListings: (api: AxiosInstance, params?: any) => 
        api.get("/api/listings", { params }),
    getListing: (api: AxiosInstance, id: string) => 
        api.get(`/api/listings/${id}`),
    createListing: (api: AxiosInstance, userId: string, data: any) => 
        api.post("/api/listings", data, { headers: { "x-user-id": userId } }),
    updateListing: (api: AxiosInstance, userId: string, id: string, data: any) => 
        api.put(`/api/listings/${id}`, data, { headers: { "x-user-id": userId } }),
    deleteListing: (api: AxiosInstance, userId: string, id: string) => 
        api.delete(`/api/listings/${id}`, { headers: { "x-user-id": userId } }),
};

export const chatApi = {
    getChats: (api: AxiosInstance, userId: string) => 
        api.get("/api/chats", { headers: { "x-user-id": userId } }),
    getOrCreateChat: (api: AxiosInstance, userId: string, participantId: string) => 
        api.post(`/api/chats/with/${participantId}`, {}, { headers: { "x-user-id": userId } }),
    getMessages: (api: AxiosInstance, userId: string, chatId: string) => 
        api.get(`/api/chats/chat/${chatId}`, { headers: { "x-user-id": userId } }),
};
