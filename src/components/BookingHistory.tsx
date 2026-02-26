import { useState, useEffect } from 'react';
import { BookingService, type Booking } from '@/services/booking.service';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Car, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function BookingHistory() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchBookings();
    }, []);

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
        <div className='grid gap-6'>
            {bookings.map((booking) => (
                <Card key={booking.booking_id} className='overflow-hidden transition-all hover:shadow-md'>
                    <div className='flex flex-col md:flex-row'>
                        <div className='relative h-48 w-full md:h-auto md:w-64'>
                            {booking.car.images?.[0] ? (
                                <img
                                    src={booking.car.images[0].image_url}
                                    alt={booking.car.name}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                <div className='bg-muted flex h-full w-full items-center justify-center'>
                                    <Car className='text-muted-foreground h-12 w-12' />
                                </div>
                            )}
                        </div>
                        <div className='flex-1 p-6'>
                            <div className='mb-4 flex items-start justify-between'>
                                <div>
                                    <h3 className='text-xl font-bold'>{booking.car.name}</h3>
                                    <p className='text-muted-foreground text-sm'>
                                        {booking.car.category.name}
                                    </p>
                                </div>
                                <Badge variant='outline' className={getStatusColor(booking.status)}>
                                    {booking.status}
                                </Badge>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div className='flex items-center gap-2 text-sm'>
                                    <Calendar className='text-primary h-4 w-4' />
                                    <span>
                                        {format(new Date(booking.start_date), 'PPP')} - {format(new Date(booking.end_date), 'PPP')}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <DollarSign className='text-primary h-4 w-4' />
                                    <span className='font-semibold'>Total: ${booking.total_price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
