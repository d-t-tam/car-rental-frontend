import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    CalendarDays,
    CarFront,
    Check,
    History,
    Loader2,
    Search,
    User2,
    X,
} from "lucide-react";

import {
    BookingService,
    type StaffPendingBooking,
    type StaffReviewHistoryBooking,
} from "@/services/booking.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

function filterBookings<T extends StaffPendingBooking>(bookings: T[], keyword: string) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
        return bookings;
    }

    return bookings.filter((booking) => {
        const customerName = booking.customer.full_name?.toLowerCase() || "";
        const email = booking.customer.user.email?.toLowerCase() || "";
        const carName = booking.car.name?.toLowerCase() || "";
        const bookingId = String(booking.booking_id);

        return (
            customerName.includes(normalized)
            || email.includes(normalized)
            || carName.includes(normalized)
            || bookingId.includes(normalized)
        );
    });
}

export function StaffBookingReviewPage() {
    const [pendingBookings, setPendingBookings] = useState<StaffPendingBooking[]>([]);
    const [historyBookings, setHistoryBookings] = useState<StaffReviewHistoryBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [pendingSearch, setPendingSearch] = useState("");
    const [historySearch, setHistorySearch] = useState("");
    const [reasons, setReasons] = useState<Record<number, string>>({});

    const fetchAll = async (showLoading = false) => {
        if (showLoading) {
            setLoading(true);
        }
        try {
            const [pending, history] = await Promise.all([
                BookingService.getPendingBookings(),
                BookingService.getReviewHistoryBookings(),
            ]);
            setPendingBookings(pending);
            setHistoryBookings(history);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Khong the tai du lieu booking cho Staff");
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAll(true);
    }, []);

    const filteredPending = useMemo(
        () => filterBookings(pendingBookings, pendingSearch),
        [pendingBookings, pendingSearch]
    );
    const filteredHistory = useMemo(
        () => filterBookings(historyBookings, historySearch),
        [historyBookings, historySearch]
    );

    const approvedCount = filteredHistory.filter((booking) => booking.status === "Confirmed").length;
    const rejectedCount = filteredHistory.filter((booking) => booking.status === "Cancelled").length;

    const handleApprove = async (bookingId: number) => {
        setProcessingId(bookingId);
        try {
            await BookingService.approveBooking(bookingId);
            toast.success(`Da duyet booking #${bookingId}`);
            await fetchAll(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                toast.error(apiError.response?.data?.message || "Duyet booking that bai");
            } else {
                toast.error("Duyet booking that bai");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (bookingId: number) => {
        setProcessingId(bookingId);
        try {
            await BookingService.rejectBooking(bookingId, reasons[bookingId]);
            setReasons((prev) => {
                const next = { ...prev };
                delete next[bookingId];
                return next;
            });
            toast.success(`Da tu choi booking #${bookingId}`);
            await fetchAll(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                toast.error(apiError.response?.data?.message || "Tu choi booking that bai");
            } else {
                toast.error("Tu choi booking that bai");
            }
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex min-h-64 items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold">Customer Request Review</h2>
                <p className="text-muted-foreground text-sm">
                    Staff co the duyet request moi va xem lich su cac request da xu ly.
                </p>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                    <TabsTrigger value="history">Review History</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Filter Pending</CardTitle>
                            <CardDescription>
                                Tim theo ma booking, ten khach, email hoac ten xe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={pendingSearch}
                                    onChange={(event) => setPendingSearch(event.target.value)}
                                    placeholder="VD: #12, customer@example.com, Toyota..."
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {filteredPending.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
                                <p className="font-medium">Khong co booking Pending</p>
                                <p className="text-muted-foreground text-sm">
                                    Request dat xe moi cua customer se hien thi tai day.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredPending.map((booking) => {
                                const isProcessing = processingId === booking.booking_id;
                                const thumbnail = booking.car.images?.[0]?.image_url;

                                return (
                                    <Card key={booking.booking_id} className="overflow-hidden border-primary/10">
                                        <CardContent className="p-0">
                                            <div className="grid lg:grid-cols-[280px_1fr]">
                                                <div className="bg-muted/40 h-56 lg:h-full">
                                                    {thumbnail ? (
                                                        <img
                                                            src={thumbnail}
                                                            alt={booking.car.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-muted-foreground flex h-full items-center justify-center">
                                                            <CarFront className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-4 p-5">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div>
                                                            <p className="text-muted-foreground text-xs">Booking ID</p>
                                                            <h3 className="text-lg font-semibold">#{booking.booking_id}</h3>
                                                        </div>
                                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                                            Pending
                                                        </Badge>
                                                    </div>

                                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <User2 className="h-3.5 w-3.5" />
                                                                Customer
                                                            </p>
                                                            <p className="text-sm font-medium">{booking.customer.full_name}</p>
                                                            <p className="text-muted-foreground text-xs">{booking.customer.user.email}</p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <CarFront className="h-3.5 w-3.5" />
                                                                Vehicle
                                                            </p>
                                                            <p className="text-sm font-medium">{booking.car.name}</p>
                                                            <p className="text-muted-foreground text-xs">
                                                                {booking.car.brand} {booking.car.model} • {booking.car.category.name}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                Rental Period
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {format(new Date(booking.start_date), "dd/MM/yyyy")} -{" "}
                                                                {format(new Date(booking.end_date), "dd/MM/yyyy")}
                                                            </p>
                                                            <p className="text-muted-foreground text-xs">
                                                                Tao luc {format(new Date(booking.created_at), "dd/MM/yyyy HH:mm")}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`reason-${booking.booking_id}`}>
                                                                Reject reason (optional)
                                                            </Label>
                                                            <Textarea
                                                                id={`reason-${booking.booking_id}`}
                                                                value={reasons[booking.booking_id] || ""}
                                                                onChange={(event) =>
                                                                    setReasons((prev) => ({
                                                                        ...prev,
                                                                        [booking.booking_id]: event.target.value,
                                                                    }))
                                                                }
                                                                placeholder="Nhap ly do tu choi booking neu can..."
                                                                className="min-h-20"
                                                            />
                                                        </div>
                                                        <div className="flex flex-wrap justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleReject(booking.booking_id)}
                                                                disabled={isProcessing}
                                                            >
                                                                {isProcessing ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <X className="mr-2 h-4 w-4" />
                                                                )}
                                                                Reject
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleApprove(booking.booking_id)}
                                                                disabled={isProcessing}
                                                            >
                                                                {isProcessing ? (
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="mr-2 h-4 w-4" />
                                                                )}
                                                                Approve
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-lg">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-muted-foreground text-xs">Approved</p>
                                <p className="text-lg font-semibold text-emerald-700">{approvedCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-muted-foreground text-xs">Rejected</p>
                                <p className="text-lg font-semibold text-red-700">{rejectedCount}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Filter History</CardTitle>
                            <CardDescription>
                                Xem lich su request da duoc approve/reject.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={historySearch}
                                    onChange={(event) => setHistorySearch(event.target.value)}
                                    placeholder="Tim theo booking, khach hang, email, xe..."
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {filteredHistory.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
                                <History className="text-muted-foreground h-8 w-8" />
                                <p className="font-medium">Chua co lich su duyet request</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredHistory.map((booking) => {
                                const actionLabel = booking.status === "Confirmed" ? "Approved" : "Rejected";
                                const actionClass = booking.status === "Confirmed"
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100";

                                return (
                                    <Card key={`history-${booking.booking_id}`}>
                                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">#{booking.booking_id}</p>
                                                    <Badge className={actionClass}>{actionLabel}</Badge>
                                                </div>
                                                <p className="text-sm">
                                                    {booking.customer.full_name} • {booking.customer.user.email}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {booking.car.name} • {format(new Date(booking.start_date), "dd/MM/yyyy")} -{" "}
                                                    {format(new Date(booking.end_date), "dd/MM/yyyy")}
                                                </p>
                                            </div>
                                            <div className="text-muted-foreground text-xs sm:text-right">
                                                <p>Reviewed at</p>
                                                <p className="font-medium text-foreground">
                                                    {format(new Date(booking.updated_at), "dd/MM/yyyy HH:mm")}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
