import { api } from "./api";

export interface CreateBookingData {
    car_id: number;
    start_date: string;
    end_date: string;
}

export class BookingService {
    static async createBooking(data: CreateBookingData) {
        const response = await api.post("/bookings", data);
        return response.data;
    }
}
