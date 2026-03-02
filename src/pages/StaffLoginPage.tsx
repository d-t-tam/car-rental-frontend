import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/services/auth.service";
import { useStaffAuth, useUserAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const staffLoginSchema = z.object({
    email: z.string().email("Email khong hop le"),
    password: z.string().min(1, "Vui long nhap mat khau"),
});

type StaffLoginFormValues = z.infer<typeof staffLoginSchema>;

export function StaffLoginPage() {
    const navigate = useNavigate();
    const { login, logout: logoutStaff } = useStaffAuth();
    const { logout: logoutUser } = useUserAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StaffLoginFormValues>({
        resolver: zodResolver(staffLoginSchema),
    });

    const onSubmit = async (data: StaffLoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await AuthService.login(data);
            const role = response.user.role.toLowerCase();

            if (role !== "staff" && role !== "admin") {
                setError("Tai khoan nay khong co quyen truy cap khu Staff.");
                return;
            }

            logoutUser();
            logoutStaff();
            login(response.user, response.token);
            navigate("/staff");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const apiError = err as { response?: { data?: { message?: string } } };
                setError(apiError.response?.data?.message || "Dang nhap that bai.");
            } else {
                setError("Dang nhap that bai.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 p-4">
            <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
                <section className="space-y-5 rounded-2xl border bg-card/80 p-8 backdrop-blur">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        <ShieldCheck className="h-4 w-4" />
                        Staff Portal
                    </div>
                    <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                        Car Rental Internal Operations
                    </h1>
                    <p className="text-muted-foreground">
                        Dang nhap bang tai khoan Staff de xu ly yeu cau dat xe, duyet booking
                        va theo doi van hanh he thong.
                    </p>
                </section>

                <Card className="border-primary/15 shadow-lg">
                    <CardContent className="p-6 sm:p-8">
                        <div className="mb-6 space-y-1 text-center">
                            <h2 className="text-2xl font-semibold">Staff Login</h2>
                            <p className="text-muted-foreground text-sm">
                                Su dung thong tin tai khoan nhan vien
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="staff-email">Email</Label>
                                <Input
                                    id="staff-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="staff@company.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-destructive text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="staff-password">Password</Label>
                                <Input
                                    id="staff-password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="******"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-destructive text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Dang dang nhap..." : "Dang nhap Staff"}
                            </Button>

                            <p className="text-muted-foreground text-center text-sm">
                                Dang nhap khach hang?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Chuyen sang Login thuong
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
