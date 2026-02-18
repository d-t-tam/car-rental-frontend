import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CarService } from "@/services/car.service";
import type { Car, CarImage, Booking } from "@/services/car.service";
import {
    ChevronLeft,
    Calendar,
    User,
    Gauge,
    Coins,
    Tag,
    Fuel,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CarDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const data = await CarService.getCarById(Number(id));
                setCar(data);
            } catch (err: any) {
                setError(err.message || "Failed to load car details");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20">
                <h2 className="text-2xl font-bold mb-4">{error || "Car not found"}</h2>
                <Button variant="ghost" asChild>
                    <Link to="/cars" className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back to browse
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header/Back Link */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="group -ml-4">
                        <Link to="/cars" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Search Results
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <Card className="aspect-[16/9] border-none shadow-xl overflow-hidden bg-muted">
                            {car.images && car.images.length > 0 ? (
                                <img
                                    src={car.images[0].image_url}
                                    alt={car.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                                    No Image Available
                                </div>
                            )}
                        </Card>
                        <div className="grid grid-cols-4 gap-4">
                            {car.images?.slice(1, 5).map((img: CarImage, idx: number) => (
                                <Card key={idx} className="aspect-square border-none shadow-md overflow-hidden bg-muted hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <Badge variant="secondary" className="mb-4 uppercase tracking-wider">
                                {car.category?.name || "Premium Rental"}
                            </Badge>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-foreground">
                                {car.name}
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                {car.brand} • {car.model} • {car.year}
                            </p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { icon: Coins, label: "Rental Price", value: `$${car.rental_price_per_day}`, sub: "/day", color: "text-yellow-500" },
                                { icon: Gauge, label: "Mileage", value: car.current_mileage.toLocaleString(), sub: " km", color: "text-green-500" },
                                { icon: Fuel, label: "Status", value: car.status, color: car.status === 'Available' ? 'text-primary' : 'text-orange-500' },
                                { icon: Tag, label: "License Plate", value: car.license_plate, color: "text-blue-500" }
                            ].map((spec, idx) => (
                                <Card key={idx} className="bg-muted/30 border-none shadow-none p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <spec.icon className={`w-6 h-6 ${spec.color}`} />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold font-sans">{spec.label}</p>
                                            <p className="text-lg font-bold text-foreground">
                                                {spec.value}
                                                {spec.sub && <span className="text-sm font-normal text-muted-foreground">{spec.sub}</span>}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Booking Activity (if any) */}
                        {car.bookings && car.bookings.length > 0 && (
                            <Card className="mb-10 bg-primary/5 border-primary/10 shadow-none rounded-3xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                                </div>
                                {car.bookings.map((booking: Booking, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-t border-primary/10 first:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{booking.customer.full_name}</p>
                                                <p className="text-xs text-muted-foreground">Recent Booking</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/50">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            CONFIRMED
                                        </Badge>
                                    </div>
                                ))}
                            </Card>
                        )}

                        {/* Description */}
                        {car.description && (
                            <div className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">About this Car</h3>
                                <p className="text-foreground leading-relaxed text-lg italic opacity-90">
                                    "{car.description}"
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="flex-1 h-16 text-lg font-extrabold uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20">
                                Reserve Now
                            </Button>
                            <Button variant="outline" size="lg" className="h-16 px-8 text-lg font-bold uppercase tracking-wider rounded-2xl">
                                Add to Wishlist
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
