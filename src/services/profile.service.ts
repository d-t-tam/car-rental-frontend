import { api } from "./api";

export interface ProfileUser {
    user_id: number;
    email: string;
    username: string;
    phone: string;
    role: string;
    status: string;
    created_at: string;
}

export interface Profile {
    user_id: number;
    full_name: string;
    license_number: string;
    address: string;
    wallet_balance: string;
}

export interface ProfileResponse {
    user: ProfileUser;
    profile: Profile;
}

export interface UpdateProfileRequest {
    full_name?: string;
    phone?: string;
    license_number?: string;
    address?: string;
}

export const ProfileService = {
    getProfile: async () => {
        const response = await api.get<ProfileResponse>("/profile");
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest) => {
        const response = await api.put<ProfileResponse>("/profile", data);
        return response.data;
    },
};
