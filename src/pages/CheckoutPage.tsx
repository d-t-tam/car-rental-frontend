import React, { useState, useEffect } from "react";
import { Loader2, CreditCard, Check, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingService, type Booking } from "@/services/booking.service";
import { PaymentModal } from "@/components/PaymentModal";
import { format } from "date-fns";

export const CheckoutPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const myBookings = await BookingService.getMyBookings();
      setBookings(myBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("Payment completed successfully!");
    setIsPaymentModalOpen(false);
    fetchBookings(); // Refresh bookings to update payment status
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400 dark:bg-green-500/20">
            <Check className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "Partially_Paid":
      case "Partially Paid":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400 dark:bg-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Partially Paid
          </Badge>
        );
      case "Unpaid":
      default:
        return (
          <Badge variant="outline" className="text-red-600 border-red-200 dark:border-red-900">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unpaid
          </Badge>
        );
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">Confirmed</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">Pending</Badge>;
      case "Active":
        return <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">Active</Badge>;
      case "Completed":
        return <Badge className="bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const unpaidBookings = bookings.filter(
    (b) => (b.payment_status || "Unpaid") !== "Paid" && b.status !== "Cancelled"
  );

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Payment Center</h1>
          <p className="text-muted-foreground mt-2">
            Manage and pay for your car rental bookings
          </p>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active and completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{unpaidBookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Require payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Owed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${unpaidBookings
                  .reduce((sum, b) => sum + (Number(b.total_price) - Number(b.total_paid)), 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert for pending payments */}
        {unpaidBookings.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have {unpaidBookings.length} booking(s) with pending payments. Please complete
              the payment to confirm your reservation.
            </AlertDescription>
          </Alert>
        )}

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>
              View all your bookings and make payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => {
                      const remaining =
                        Number(booking.total_price) - Number(booking.total_paid || 0);
                      const isPaid = Number(booking.total_paid || 0) >= Number(booking.total_price);

                      return (
                        <TableRow key={booking.booking_id}>
                          <TableCell>
                            <div>
                              <p className="font-semibold">{booking.car.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.car.brand || "N/A"} {booking.car.model || ""}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <p>
                                {format(new Date(booking.start_date), "MMM dd, yyyy")}
                              </p>
                              <p className="text-muted-foreground">
                                to {format(new Date(booking.end_date), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getBookingStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${Number(booking.total_price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-semibold">
                                ${Number(booking.total_paid || 0).toFixed(2)}
                              </p>
                              {remaining > 0 && (
                                <p className="text-xs text-red-600">
                                  ${remaining.toFixed(2)} remaining
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(booking.payment_status || "Unpaid")}
                          </TableCell>
                          <TableCell className="text-right">
                            {!isPaid && booking.status !== "Cancelled" ? (
                              <Button
                                size="sm"
                                onClick={() => handlePaymentClick(booking)}
                                className="gap-2"
                              >
                                <CreditCard className="w-4 h-4" />
                                Pay
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {isPaid ? "Paid" : "N/A"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      {selectedBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.booking_id}
          totalPrice={Number(selectedBooking.total_price)}
          totalPaid={Number(selectedBooking.total_paid)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
