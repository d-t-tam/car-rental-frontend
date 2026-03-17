import { api } from "./api";

export type PaymentMethod = "Cash" | "Banking" | "E-Wallet" | "Wallet";

export interface Transaction {
  transaction_id: number;
  booking_id: number;
  amount: string;
  payment_method: PaymentMethod;
  status: "Pending" | "Success" | "Failed";
  transaction_date: string;
  type: string;
  gateway_txn_id?: string;
}

export interface ProcessPaymentData {
  booking_id: number;
  amount: number;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface PaymentResponse {
  message: string;
  payment: Transaction;
}

export interface PaymentHistoryResponse {
  transaction_id: number;
  booking_id: number;
  amount: string;
  payment_method: PaymentMethod;
  status: string;
  transaction_date: string;
  type: string;
}

export interface PaymentSummary {
  booking_id: number;
  total_price: string;
  total_paid: string;
  remaining_amount: number;
  payment_status: string;
  transaction_count?: number;
  last_payment?: Transaction | null;
}

export class PaymentService {
  /**
   * Process a payment for a booking
   */
  static async processPayment(data: ProcessPaymentData): Promise<PaymentResponse> {
    const response = await api.post("/payments", data);
    return response.data;
  }

  /**
   * Get payment history for a booking
   */
  static async getPaymentHistory(bookingId: number): Promise<PaymentHistoryResponse[]> {
    const response = await api.get(`/payments/booking/${bookingId}/history`);
    return response.data;
  }

  /**
   * Get payment summary for a booking
   */
  static async getPaymentSummary(bookingId: number): Promise<PaymentSummary> {
    const response = await api.get(`/payments/booking/${bookingId}/summary`);
    return response.data;
  }

  /**
   * Get all payments for the current customer
   */
  static async getCustomerPayments(): Promise<PaymentHistoryResponse[]> {
    const response = await api.get("/payments/customer/all");
    return response.data;
  }

  /**
   * Process refund for a booking
   */
  static async processRefund(bookingId: number, amount: number, reason?: string): Promise<PaymentResponse> {
    const response = await api.post(`/payments/booking/${bookingId}/refund`, {
      amount,
      reason
    });
    return response.data;
  }
}
