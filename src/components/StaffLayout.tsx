import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStaffAuth } from "@/contexts/AuthContext";
import { ClipboardCheck, LayoutDashboard, LogOut } from "lucide-react";

const navigationItems = [
    {
        label: "Dashboard",
        path: "/staff",
        icon: LayoutDashboard,
    },
    {
        label: "Booking Review",
        path: "/staff/bookings",
        icon: ClipboardCheck,
    },
];

export function StaffLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { staff, logout } = useStaffAuth();

    const handleLogout = () => {
        logout();
        navigate("/staff/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
            <header className="border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                            Staff Portal
                        </Badge>
                        <div className="leading-tight">
                            <p className="text-sm font-semibold">{staff?.username}</p>
                            <p className="text-muted-foreground text-xs">{staff?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>
            <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
                <aside className="h-fit rounded-xl border bg-card p-2">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mb-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </aside>
                <section className="space-y-4">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}
