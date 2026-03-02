import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const pathname = typeof window !== "undefined" ? window.location.pathname : "";
        const isStaffArea = pathname.startsWith("/staff");

        const token = isStaffArea
            ? localStorage.getItem("staff_token") || localStorage.getItem("user_token")
            : localStorage.getItem("user_token") || localStorage.getItem("staff_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
