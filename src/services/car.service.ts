import { api } from "./api";

export interface CarCategory {
    category_id: number;
    name: string;
    description?: string;
    min_price: number;
}

export interface CarImage {
    image_id: number;
    car_id: number;
    image_url: string;
    is_thumbnail: boolean;
}

export interface User {
    username: string;
    email: string;
    phone?: string;
}

export interface CustomerProfile {
    full_name: string;
    user?: User;
}

export interface Booking {
    booking_id: number;
    status: string;
    customer: CustomerProfile;
}

export interface Car {
    car_id: number;
    category_id: number;
    name: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    license_plate: string;
    vin_number: string;
    status: string;
    rental_price_per_day: number;
    current_mileage: number;
    description?: string;
    created_at: string;
    updated_at: string;
    category?: CarCategory;
    images?: CarImage[];
    bookings?: Booking[];
}

export interface CarSearchQuery {
    name?: string;
    brand?: string;
    model?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    status?: string;
}

export const CarService = {
    searchCars: async (query: CarSearchQuery) => {
        const response = await api.get<Car[]>("/cars/search", { params: query });
        return response.data;
    },

    getCarById: async (id: number) => {
        const response = await api.get<Car>(`/cars/${id}`);
        return response.data;
    },
};
