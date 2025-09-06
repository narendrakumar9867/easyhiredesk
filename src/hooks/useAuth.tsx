import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";

interface User {
    _id: string;
    email: string;
    role?: string;
    profilePic?: string;
}

interface SignUpData {
    role: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface UpdateProfileData {
    profilePic?: string;
}

interface AuthResponse {
    token?: string;
    _id: string;
    email: string;
    role?: string;
    profilePic?: string;
}

interface AuthStore {
    authUser: User | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    token: string | null;
    checkAuth: () => Promise<void>;
    signup: (data: SignUpData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    setToken: (token: string) => void;
}

export const useAuth = create<AuthStore>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    token: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const token = localStorage.getItem("token");
            
            if(!token) {
                console.warn("no token found in localStorage.");
                set({ authUser: null, isCheckingAuth: false });
                return;
            }

            const res = await axiosInstance.get<AuthResponse>("/auth/check", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ authUser: res.data, token, isCheckingAuth: false });
        } catch (error) {
            console.error("Error checking auth:", error);
            localStorage.removeItem("token");
            set({ authUser: null, token: null, isCheckingAuth: false });
        }
    },

    signup: async (data: SignUpData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post<AuthResponse>("/auth/signup", data);
            const token = res.data.token;

            if(token) {
                localStorage.setItem("token", token);
                set({ token });
            }
            
            set({ authUser: res.data });
            toast.success("Account created successfully.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Signup failed.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data: LoginData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
            const token = res.data.token;

            if(token) {
                localStorage.setItem("token", token);
                set({ token });
            }
            set({ authUser: res.data });
            toast.success("Logged in successfully.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed.");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("token");
            set({ authUser: null, token: null });
            toast.success("Logged out successfully.");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Logout failed.");
        }
    },

    updateProfile: async (data: UpdateProfileData) => {
        set({ isUpdatingProfile: true });
        try {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.put<AuthResponse>("/auth/update-profile", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ authUser: res.data });
            toast.success("Profile updated successfully.");
        } catch (error: any) {
            console.error("Error updating profile.", error);
            toast.error(error.response?.data?.message || "Profile update failed.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    
    setToken: (token: string) => set({ token })
}));