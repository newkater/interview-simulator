import axios from "axios";
import type { RefreshResponse } from "../features/auth/types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const storedRefreshToken = localStorage.getItem("refreshToken");
                if (!storedRefreshToken) throw new Error("No refresh token stored locally.");

                const refreshResponse = await axios.post<RefreshResponse>(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refreshToken: storedRefreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                localStorage.setItem("token", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
