import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CarService } from '@/services/car.service';
import type { Car, CarSearchQuery } from '@/services/car.service';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader2 } from 'lucide-react';

export function BrowseCarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<CarSearchQuery>({});
    const [tempSearch, setTempSearch] = useState<CarSearchQuery>({});

    const fetchCars = async (query: CarSearchQuery) => {
        setLoading(true);
        try {
            const data = await CarService.searchCars(query);
            setCars(data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars(searchQuery);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery({ ...tempSearch });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempSearch((prev) => ({
            ...prev,
            [name]: value === '' ? undefined : value,
        }));
    };

    return (
        <main className='flex-1 container mx-auto py-8 px-4'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <div>
                    <h1 className='text-3xl font-bold'>Browse Cars</h1>
                    <p className='text-muted-foreground'>Find the perfect car for your trip</p>
                </div>
            </div>

            {/* Search and Filters */}
            <section className='bg-slate-50 dark:bg-slate-900 p-6 rounded-lg mb-8'>
                <form onSubmit={handleSearch} className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                    <div className='relative'>
                        <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Search by name...'
                            name='name'
                            value={tempSearch.name || ''}
                            onChange={handleInputChange}
                            className='pl-10'
                        />
                    </div>
                    <div className='relative'>
                        <Input
                            placeholder='Brand (e.g. Toyota)'
                            name='brand'
                            value={tempSearch.brand || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='flex gap-2'>
                        <Input
                            type='number'
                            placeholder='Min Price'
                            name='min_price'
                            value={tempSearch.min_price || ''}
                            onChange={handleInputChange}
                            className='w-1/2'
                        />
                        <Input
                            type='number'
                            placeholder='Max Price'
                            name='max_price'
                            value={tempSearch.max_price || ''}
                            onChange={handleInputChange}
                            className='w-1/2'
                        />
                    </div>
                    <Button type='submit' className='w-full'>
                        <Filter className='mr-2 h-4 w-4' /> Search & Filter
                    </Button>
                </form>
            </section>

            {/* Results */}
            {loading ? (
                <div className='flex justify-center items-center py-20'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            ) : cars.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {cars.map((car) => (
                        <Card key={car.car_id} className='flex flex-col'>
                            <CardHeader className='p-0'>
                                <img
                                    src={car.images && car.images.length > 0
                                        ? car.images.find(img => img.is_thumbnail)?.image_url || car.images[0].image_url
                                        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'}
                                    alt={car.name}
                                    className='aspect-video w-full object-cover rounded-t-xl'
                                />
                            </CardHeader>
                            <CardContent className='p-4 pt-2 flex-1'>
                                <div className='flex justify-between items-start mb-2'>
                                    <div>
                                        <CardTitle className='text-xl'>{car.name}</CardTitle>
                                        <CardDescription>{car.brand} {car.model} ({car.year})</CardDescription>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {car.status}
                                    </span>
                                </div>
                                <div className='mt-2'>
                                    <p className='text-sm text-muted-foreground line-clamp-2'>
                                        {car.description || 'No description available.'}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className='p-4 pt-0 flex items-center justify-between'>
                                <div className='flex flex-col'>
                                    <span className='text-lg font-bold text-primary'>${car.rental_price_per_day}</span>
                                    <span className='text-xs text-muted-foreground'>per day</span>
                                </div>
                                <Button size='sm' asChild>
                                    <Link to={`/cars/${car.car_id}`}>Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className='text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-lg'>
                    <p className='text-xl text-muted-foreground'>No cars found matching your criteria.</p>
                    <Button variant='outline' className='mt-4' onClick={() => {
                        setSearchQuery({});
                        setTempSearch({});
                    }}>
                        Clear filters
                    </Button>
                </div>
            )}
        </main>
    );
}
