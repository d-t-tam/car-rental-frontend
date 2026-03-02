import { Navigate, Outlet } from "react-router-dom";
import { useStaffAuth } from "@/contexts/AuthContext";

export function RequireStaffAuth() {
    const { staff, isStaffAuthenticated } = useStaffAuth();

    if (!isStaffAuthenticated || !staff) {
        return <Navigate to="/staff/login" replace />;
    }

    const role = staff.role.toLowerCase();
    if (role !== "staff" && role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
