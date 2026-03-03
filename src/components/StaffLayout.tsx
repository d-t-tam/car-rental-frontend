import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStaffAuth } from "@/contexts/AuthContext";
import { ClipboardCheck, Handshake, LayoutDashboard, LogOut } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

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
    {
        label: "Ban giao xe",
        path: "/staff/handover",
        icon: Handshake,
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
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="offcanvas">
                <SidebarContent>
                    <SidebarGroup className="pt-4">
                        <div className="px-2 pb-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                Staff Portal
                            </Badge>
                        </div>
                        <SidebarMenu>
                            {navigationItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;

                                return (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link to={item.path}>
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            <SidebarInset className="min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
                <header className="border-b bg-background/90 backdrop-blur">
                    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger />
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
                <section className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </section>
            </SidebarInset>
        </SidebarProvider>
    );
}
