import { useState, useEffect } from 'react';
import { BookingService, type Booking } from '@/services/booking.service';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, Calendar, Car, DollarSign, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function BookingHistory() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const fetchBookings = async () => {
        try {
            const data = await BookingService.getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            toast.error('Failed to load booking history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId: number) => {
        setCancellingId(bookingId);
        try {
            await BookingService.cancelBooking(bookingId);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (err: any) {
            console.error('Cancel Error:', err);
            toast.error(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'deposit paid':
            case 'deposit_paid':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const canCancel = (status: string) => {
        const s = status.toLowerCase();
        return ['pending', 'confirmed', 'deposit paid', 'deposit_paid'].includes(s);
    };

    if (loading) {
        return (
            <div className='flex min-h-[200px] items-center justify-center'>
                <Loader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <Card className='border-dashed'>
                <CardContent className='flex flex-col items-center justify-center py-12'>
                    <Calendar className='text-muted-foreground mb-4 h-12 w-12 opacity-20' />
                    <p className='text-muted-foreground text-lg font-medium'>No bookings yet</p>
                    <p className='text-muted-foreground text-sm'>
                        Your booking history will appear here once you make your first reservation.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='grid gap-8'>
            {bookings.map((booking) => {
                const isCancelled = booking.status.toLowerCase() === 'cancelled';

                return (
                    <Card
                        key={booking.booking_id}
                        className={`group relative overflow-hidden border-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isCancelled ? 'opacity-80' : ''
                            }`}
                    >
                        <div className='flex flex-col md:flex-row'>
                            {/* Image Section */}
                            <div className='relative h-56 w-full overflow-hidden md:h-auto md:w-80'>
                                {booking.car.images?.[0] ? (
                                    <img
                                        src={booking.car.images[0].image_url}
                                        alt={booking.car.name}
                                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isCancelled ? 'grayscale' : ''
                                            }`}
                                    />
                                ) : (
                                    <div className='bg-muted flex h-full w-full items-center justify-center'>
                                        <Car className='text-muted-foreground h-16 w-16 opacity-20' />
                                    </div>
                                )}

                                {/* Visual indicator for cancelled bookings */}
                                {isCancelled && (
                                    <div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]'>
                                        <Badge variant='destructive' className='px-4 py-1 text-sm font-bold uppercase tracking-widest shadow-lg'>
                                            Cancelled
                                        </Badge>
                                    </div>
                                )}

                                {/* Status Badge overlay on image for non-cancelled */}
                                {!isCancelled && (
                                    <div className='absolute top-4 left-4'>
                                        <Badge
                                            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-md ${getStatusColor(booking.status)}`}
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className='flex flex-1 flex-col justify-between p-8 bg-card/50 backdrop-blur-sm'>
                                <div>
                                    <div className='mb-2 flex items-center gap-2'>
                                        <span className='text-primary text-xs font-bold uppercase tracking-widest'>
                                            {booking.car.category.name}
                                        </span>
                                    </div>
                                    <h3 className='text-3xl font-black tracking-tight text-foreground'>
                                        {booking.car.name}
                                    </h3>

                                    <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                                        <div className='space-y-1'>
                                            <p className='text-muted-foreground text-[10px] font-bold uppercase tracking-widest'>Rental Period</p>
                                            <div className='flex items-center gap-3'>
                                                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                                    <Calendar className='text-primary h-5 w-5' />
                                                </div>
                                                <div>
                                                    <p className='text-sm font-bold'>
                                                        {format(new Date(booking.start_date), 'MMM d')} — {format(new Date(booking.end_date), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='space-y-1'>
                                            <p className='text-muted-foreground text-[10px] font-bold uppercase tracking-widest'>Total Amount</p>
                                            <div className='flex items-center gap-3'>
                                                <div className='bg-green-500/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                                    <DollarSign className='text-green-600 h-5 w-5' />
                                                </div>
                                                <p className='text-2xl font-black text-foreground'>
                                                    ${booking.total_price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                {canCancel(booking.status) && (
                                    <div className='mt-8 pt-6 border-t border-border/50 flex justify-end'>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    className='text-destructive/70 hover:text-destructive hover:bg-destructive/10 font-bold transition-colors'
                                                >
                                                    <XCircle className='mr-2 h-4 w-4' />
                                                    Cancel Reservation
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className='border-none shadow-2xl'>
                                                <AlertDialogHeader>
                                                    <div className='mx-auto mb-4 bg-destructive/10 p-4 rounded-full w-fit'>
                                                        <XCircle className='h-12 w-12 text-destructive' />
                                                    </div>
                                                    <AlertDialogTitle className='text-center text-2xl font-black'>Confirm Cancellation</AlertDialogTitle>
                                                    <AlertDialogDescription className='text-center text-lg'>
                                                        Are you sure you want to cancel your booking for <span className='font-bold text-foreground'>{booking.car.name}</span>?
                                                        <br />
                                                        <span className='mt-2 block text-sm italic'>This action cannot be undone.</span>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className='mt-6 sm:justify-center gap-3'>
                                                    <AlertDialogCancel className='rounded-xl font-bold px-8'>Go back</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleCancel(booking.booking_id)}
                                                        className='bg-destructive hover:bg-destructive/90 rounded-xl font-bold px-8'
                                                        disabled={cancellingId === booking.booking_id}
                                                    >
                                                        {cancellingId === booking.booking_id ? (
                                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                        ) : 'Cancel Booking'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
