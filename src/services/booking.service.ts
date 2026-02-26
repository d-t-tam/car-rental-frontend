import { api } from "./api";

export interface CreateBookingData {
    car_id: number;
    start_date: string;
    end_date: string;
}

export interface Booking {
    booking_id: number;
    customer_id: number;
    car_id: number;
    start_date: string;
    end_date: string;
    total_price: string;
    status: string;
    car: {
        car_id: number;
        name: string;
        category: { name: string };
        images: { image_url: string; is_thumbnail: boolean }[];
    };
}

export class BookingService {
    static async createBooking(data: CreateBookingData) {
        const response = await api.post("/bookings", data);
        return response.data;
    }

    static async getBookedDates(carId: number): Promise<{ start_date: string; end_date: string }[]> {
        const response = await api.get(`/bookings/car/${carId}/booked-dates`);
        return response.data;
    }

    static async getMyBookings(): Promise<Booking[]> {
        const response = await api.get("/bookings/my-bookings");
        return response.data;
    }

    static async cancelBooking(bookingId: number): Promise<void> {
        await api.patch(`/bookings/${bookingId}/cancel`);
    }
}
