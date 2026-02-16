import { api } from "./api";

// Types based on API Documentation
export interface User {
    user_id: number;
    email: string;
    username: string;
    role: string;
    status: string;
    created_at?: string;
}

export interface CustomerProfile {
    profile_id: number;
    user_id: number;
    full_name: string;
    license_number: string;
    address: string;
    wallet_balance: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    full_name: string;
    phone: string;
    license_number: string;
    address: string;
}

export interface RegisterResponse {
    message: string;
    token: string;
    user: User;
    profile: CustomerProfile;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export const AuthService = {
    register: async (data: RegisterRequest) => {
        const response = await api.post<RegisterResponse>("/auth/register", data);
        return response.data;
    },

    login: async (data: LoginRequest) => {
        const response = await api.post<LoginResponse>("/auth/login", data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};
