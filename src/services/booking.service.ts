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

export interface StaffPendingBooking {
    booking_id: number;
    customer_id: number;
    car_id: number;
    start_date: string;
    end_date: string;
    total_price: string;
    total_paid: string;
    status: string;
    payment_status: string;
    created_at: string;
    updated_at: string;
    car: {
        car_id: number;
        name: string;
        brand: string;
        model: string;
        status: string;
        current_mileage: number;
        rental_price_per_day: string;
        category: { name: string };
        images: { image_url: string; is_thumbnail: boolean }[];
    };
    customer: {
        user_id: number;
        full_name: string;
        user: {
            email: string;
            username: string;
            phone: string | null;
        };
    };
}

export type StaffReviewHistoryBooking = StaffPendingBooking;
export type StaffHandoverBooking = StaffPendingBooking;
export type StaffReturnBooking = StaffPendingBooking;

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

    static async getPendingBookings(): Promise<StaffPendingBooking[]> {
        const response = await api.get("/bookings/pending");
        return response.data;
    }

    static async getHandoverReadyBookings(): Promise<StaffHandoverBooking[]> {
        const response = await api.get("/bookings/handover-ready");
        return response.data;
    }

    static async getReturnReadyBookings(): Promise<StaffReturnBooking[]> {
        const response = await api.get("/bookings/return-ready");
        return response.data;
    }

    static async getReviewHistoryBookings(): Promise<StaffReviewHistoryBooking[]> {
        const response = await api.get("/bookings/review-history");
        return response.data;
    }

    static async approveBooking(bookingId: number): Promise<void> {
        await api.patch(`/bookings/${bookingId}/approve`);
    }

    static async rejectBooking(bookingId: number, reason?: string): Promise<void> {
        await api.patch(`/bookings/${bookingId}/reject`, { reason });
    }

    static async handoverCar(bookingId: number, data: {
        odometer_reading: number;
        fuel_level: number;
        condition_summary?: string;
        customer_signature_url?: string;
    }): Promise<void> {
        await api.post(`/bookings/${bookingId}/handover`, data);
    }

    static async receiveReturnedCar(bookingId: number, data: {
        odometer_reading: number;
        fuel_level: number;
        condition_summary?: string;
        customer_signature_url?: string;
    }): Promise<void> {
        await api.post(`/bookings/${bookingId}/return`, data);
    }
}
