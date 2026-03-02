import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { User } from "@/services/auth.service";

interface UserAuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

interface StaffAuthContextType {
    staff: User | null;
    isStaffAuthenticated: boolean;
    login: (staff: User, token: string) => void;
    logout: () => void;
}

const USER_TOKEN_KEY = "user_token";
const USER_PROFILE_KEY = "user_profile";
const STAFF_TOKEN_KEY = "staff_token";
const STAFF_PROFILE_KEY = "staff_profile";

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);
const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

function parseStoredUser(value: string | null): User | null {
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value) as User;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const current = parseStoredUser(localStorage.getItem(USER_PROFILE_KEY));
        if (current) {
            return current;
        }
        return parseStoredUser(localStorage.getItem("user"));
    });

    const [staff, setStaff] = useState<User | null>(() => {
        const current = parseStoredUser(localStorage.getItem(STAFF_PROFILE_KEY));
        if (current) {
            return current;
        }
        return null;
    });

    const userLogin = useCallback((nextUser: User, token: string) => {
        localStorage.setItem(USER_TOKEN_KEY, token);
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
    }, []);

    const userLogout = useCallback(() => {
        localStorage.removeItem(USER_TOKEN_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const staffLogin = useCallback((nextStaff: User, token: string) => {
        localStorage.setItem(STAFF_TOKEN_KEY, token);
        localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(nextStaff));
        setStaff(nextStaff);
    }, []);

    const staffLogout = useCallback(() => {
        localStorage.removeItem(STAFF_TOKEN_KEY);
        localStorage.removeItem(STAFF_PROFILE_KEY);
        setStaff(null);
    }, []);

    return (
        <UserAuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login: userLogin,
                logout: userLogout,
            }}
        >
            <StaffAuthContext.Provider
                value={{
                    staff,
                    isStaffAuthenticated: !!staff,
                    login: staffLogin,
                    logout: staffLogout,
                }}
            >
                {children}
            </StaffAuthContext.Provider>
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    const context = useContext(UserAuthContext);
    if (!context) {
        throw new Error("useUserAuth must be used within an AuthProvider");
    }
    return context;
}

export function useStaffAuth() {
    const context = useContext(StaffAuthContext);
    if (!context) {
        throw new Error("useStaffAuth must be used within an AuthProvider");
    }
    return context;
}
