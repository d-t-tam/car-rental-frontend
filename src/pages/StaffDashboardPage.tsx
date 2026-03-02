import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, ClipboardCheck, ShieldCheck } from "lucide-react";

export function StaffDashboardPage() {
    return (
        <>
            <div>
                <h1 className="text-2xl font-semibold sm:text-3xl">Staff Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Manage booking approvals and monitor daily operations.
                </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardDescription>Pending requests</CardDescription>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ClipboardCheck className="text-primary h-5 w-5" />
                            0
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        Booking approval queue will appear here.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Operational alerts</CardDescription>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <BellRing className="text-primary h-5 w-5" />
                            0
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                        Maintenance and incident alerts will be shown here.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Access level</CardDescription>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <ShieldCheck className="text-primary h-5 w-5" />
                            Staff
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20" variant="secondary">
                            Active
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
