import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CarFront, Loader2, Search, Undo2, User2, Waypoints } from "lucide-react";

import { BookingService, type StaffHandoverBooking, type StaffReturnBooking } from "@/services/booking.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function filterBookings<T extends StaffHandoverBooking>(bookings: T[], keyword: string) {
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

export function StaffHandoverPage() {
    const [handoverBookings, setHandoverBookings] = useState<StaffHandoverBooking[]>([]);
    const [returnBookings, setReturnBookings] = useState<StaffReturnBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [handoverSearch, setHandoverSearch] = useState("");
    const [returnSearch, setReturnSearch] = useState("");

    const fetchQueues = async (showLoading = false) => {
        if (showLoading) {
            setLoading(true);
        }
        try {
            const [handover, returnQueue] = await Promise.all([
                BookingService.getHandoverReadyBookings(),
                BookingService.getReturnReadyBookings(),
            ]);
            setHandoverBookings(handover);
            setReturnBookings(returnQueue);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Khong the tai du lieu ban giao xe");
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchQueues(true);
    }, []);

    const filteredHandover = useMemo(
        () => filterBookings(handoverBookings, handoverSearch),
        [handoverBookings, handoverSearch]
    );
    const filteredReturn = useMemo(
        () => filterBookings(returnBookings, returnSearch),
        [returnBookings, returnSearch]
    );

    const handleHandover = async (booking: StaffHandoverBooking) => {
        setProcessingId(booking.booking_id);
        try {
            await BookingService.handoverCar(booking.booking_id, {
                odometer_reading: booking.car.current_mileage,
                fuel_level: 100,
                condition_summary: "Xe da duoc giao cho khach.",
            });
            toast.success(`Da giao xe booking #${booking.booking_id}`);
            await fetchQueues(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                toast.error(apiError.response?.data?.message || "Khong the giao xe");
            } else {
                toast.error("Khong the giao xe");
            }
        } finally {
            setProcessingId(null);
        }
    };

    const handleReturn = async (booking: StaffReturnBooking) => {
        setProcessingId(booking.booking_id);
        try {
            await BookingService.receiveReturnedCar(booking.booking_id, {
                odometer_reading: booking.car.current_mileage,
                fuel_level: 50,
                condition_summary: "Da nhan lai xe tu khach.",
            });
            toast.success(`Da nhan lai xe booking #${booking.booking_id}`);
            await fetchQueues(false);
        } catch (error: unknown) {
            if (error && typeof error === "object" && "response" in error) {
                const apiError = error as { response?: { data?: { message?: string } } };
                toast.error(apiError.response?.data?.message || "Khong the nhan lai xe");
            } else {
                toast.error("Khong the nhan lai xe");
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
                <h1 className="text-2xl font-semibold">Ban Giao Xe</h1>
                <p className="text-muted-foreground text-sm">
                    Quan ly quy trinh giao xe cho khach va nhan xe tra ve.
                </p>
            </div>

            <Tabs defaultValue="handover" className="space-y-4">
                <TabsList className="grid w-full max-w-lg grid-cols-2">
                    <TabsTrigger value="handover">Giao xe cho khach</TabsTrigger>
                    <TabsTrigger value="return">Nhan xe tu khach</TabsTrigger>
                </TabsList>

                <TabsContent value="handover" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Danh sach cho giao xe</CardTitle>
                            <CardDescription>
                                Chi hien thi booking da duoc approve (Confirmed/Deposit Paid).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={handoverSearch}
                                    onChange={(event) => setHandoverSearch(event.target.value)}
                                    placeholder="Tim theo booking, khach hang, email, xe..."
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {filteredHandover.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                                Khong co booking nao dang cho giao xe.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredHandover.map((booking) => {
                                const isProcessing = processingId === booking.booking_id;
                                return (
                                    <Card key={`handover-${booking.booking_id}`}>
                                        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">#{booking.booking_id}</p>
                                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm">
                                                    <User2 className="mr-1 inline h-3.5 w-3.5" />
                                                    {booking.customer.full_name} • {booking.customer.user.email}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    <CarFront className="mr-1 inline h-3.5 w-3.5" />
                                                    {booking.car.name} • {format(new Date(booking.start_date), "dd/MM/yyyy")} -{" "}
                                                    {format(new Date(booking.end_date), "dd/MM/yyyy")}
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handleHandover(booking)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Waypoints className="mr-2 h-4 w-4" />
                                                )}
                                                Danh dau la da giao xe
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="return" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Danh sach cho nhan xe</CardTitle>
                            <CardDescription>
                                Chi hien thi booking co trang thai Da giao xe (Active).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    value={returnSearch}
                                    onChange={(event) => setReturnSearch(event.target.value)}
                                    placeholder="Tim theo booking, khach hang, email, xe..."
                                    className="pl-9"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {filteredReturn.length === 0 ? (
                        <Card>
                            <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                                Khong co booking nao dang cho nhan xe.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredReturn.map((booking) => {
                                const isProcessing = processingId === booking.booking_id;
                                return (
                                    <Card key={`return-${booking.booking_id}`}>
                                        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold">#{booking.booking_id}</p>
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm">
                                                    <User2 className="mr-1 inline h-3.5 w-3.5" />
                                                    {booking.customer.full_name} • {booking.customer.user.email}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    <CarFront className="mr-1 inline h-3.5 w-3.5" />
                                                    {booking.car.name} • {format(new Date(booking.start_date), "dd/MM/yyyy")} -{" "}
                                                    {format(new Date(booking.end_date), "dd/MM/yyyy")}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleReturn(booking)}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Undo2 className="mr-2 h-4 w-4" />
                                                )}
                                                Danh dau la da tra xe
                                            </Button>
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
