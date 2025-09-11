import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    initializeAuth: () => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set, get) => ({
            authUser: null,
            isSigningUp: false,
            isLoggingIn: false,
            isUpdatingProfile: false,
            isCheckingAuth: false,
            token: null,

            // Initialize auth state from localStorage
            initializeAuth: () => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem("token");
                    const storedUser = localStorage.getItem("authUser");
                    
                    if (token && storedUser) {
                        try {
                            const user = JSON.parse(storedUser);
                            set({ 
                                token, 
                                authUser: user, 
                                isCheckingAuth: false 
                            });
                        } catch (error) {
                            console.error("Error parsing stored user:", error);
                            localStorage.removeItem("token");
                            localStorage.removeItem("authUser");
                        }
                    }
                }
            },

            checkAuth: async () => {
                set({ isCheckingAuth: true });
                try {
                    const token = get().token || localStorage.getItem("token");
                    
                    if (!token) {
                        console.warn("No token found");
                        set({ authUser: null, isCheckingAuth: false, token: null });
                        return;
                    }

                    // Verify token with backend
                    const res = await axiosInstance.get<AuthResponse>("/auth/check", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Store user data in localStorage for persistence
                    localStorage.setItem("authUser", JSON.stringify(res.data));
                    
                    set({ 
                        authUser: res.data, 
                        token, 
                        isCheckingAuth: false 
                    });

                } catch (error: any) {
                    console.error("Error checking auth:", error);
                    
                    // Clear all auth data on failure
                    localStorage.removeItem("token");
                    localStorage.removeItem("authUser");
                    set({ 
                        authUser: null, 
                        token: null, 
                        isCheckingAuth: false 
                    });

                    // Only show error if it's not a network/server issue
                    if (error.response?.status !== 404) {
                        toast.error("Authentication failed. Please login again.");
                    }
                }
            },

            signup: async (data: SignUpData) => {
                set({ isSigningUp: true });
                try {
                    const res = await axiosInstance.post<AuthResponse>("/auth/signup", data);
                    const token = res.data.token;

                    if (token) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("authUser", JSON.stringify(res.data));
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

                    if (token) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("authUser", JSON.stringify(res.data));
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
                    const token = get().token;
                    if (token) {
                        await axiosInstance.post("/auth/logout", {}, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    }
                } catch (error: any) {
                    console.error("Logout API call failed:", error);
                    // Continue with local logout even if API fails
                } finally {
                    // Always clear local data
                    localStorage.removeItem("token");
                    localStorage.removeItem("authUser");
                    set({ authUser: null, token: null });
                    toast.success("Logged out successfully.");
                }
            },

            updateProfile: async (data: UpdateProfileData) => {
                set({ isUpdatingProfile: true });
                try {
                    const token = get().token || localStorage.getItem("token");
                    const res = await axiosInstance.put<AuthResponse>("/auth/update-profile", data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    // Update localStorage
                    localStorage.setItem("authUser", JSON.stringify(res.data));
                    
                    set({ authUser: res.data });
                    toast.success("Profile updated successfully.");
                } catch (error: any) {
                    console.error("Error updating profile:", error);
                    toast.error(error.response?.data?.message || "Profile update failed.");
                } finally {
                    set({ isUpdatingProfile: false });
                }
            },
            
            setToken: (token: string) => {
                localStorage.setItem("token", token);
                set({ token });
            }
        }),
        {
            name: "auth-storage", // unique name for localStorage key
            partialize: (state) => ({ 
                token: state.token, 
                authUser: state.authUser 
            }),
        }
    )
);
