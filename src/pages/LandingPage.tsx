
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function LandingPage() {
    const featuredCars = [
        {
            id: 1,
            name: "Tesla Model 3",
            type: "Electric",
            price: "$100/day",
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 2,
            name: "BMW M4",
            type: "Sports",
            price: "$150/day",
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
        {
            id: 3,
            name: "Mercedes C-Class",
            type: "Luxury",
            price: "$120/day",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            Rent the car of your dreams.
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Choose from a wide range of premium vehicles for your next adventure. Affordable rates, 24/7 support, and easy booking.
                        </p>
                        <div className="space-x-4">
                            <Button size="lg" asChild>
                                <Link to="/cars">Browse Cars</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/contact">Contact Sales</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Featured Cars Section */}
                <section className="container space-y-6 py-8 md:py-12 lg:py-24" id="featured">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Featured Cars
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Check out our most popular vehicles available for rent today.
                        </p>
                    </div>
                    <div className="grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mx-auto">
                        {featuredCars.map((car) => (
                            <Card key={car.id}>
                                <CardHeader>
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        className="aspect-video w-full rounded-md object-cover"
                                    />
                                </CardHeader>
                                <CardContent>
                                    <CardTitle>{car.name}</CardTitle>
                                    <CardDescription>{car.type}</CardDescription>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                    <span className="font-bold">{car.price}</span>
                                    <Button size="sm" asChild>
                                        <Link to={`/cars/${car.id}`}>Details</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Services Section */}
                <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24" id="services">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Why Choose Us?
                        </h2>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold">24/7 Support</h3>
                                    <p className="text-sm text-muted-foreground">We are always here to help you with any questions or issues.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold">Best Prices</h3>
                                    <p className="text-sm text-muted-foreground">We offer competitive rates and special discounts for long-term rentals.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                                <div className="space-y-2">
                                    <h3 className="font-bold">Easy Booking</h3>
                                    <p className="text-sm text-muted-foreground">Book your car in just a few clicks with our user-friendly platform.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
