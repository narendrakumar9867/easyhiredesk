import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { getAuthProviderByEmail, getCachedAuthProviderByEmail, upsertAuthProviderByEmail } from "../utils/authProviderStore";

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
    role: string;
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
    isGoogleSigningIn: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    token: string | null;
    checkAuth: () => Promise<void>;
    signup: (data: SignUpData) => Promise<void>;
    signupWithGoogle: (role: string) => Promise<void>;
    loginWithGoogle: (role: string) => Promise<void>;
    getLoginAuthProvider: (email: string) => Promise<"email" | "google" | null>;
    getCachedLoginAuthProvider: (email: string) => "email" | "google" | null;
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
            isGoogleSigningIn: false,
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
                    // Check existing backend JWT only.
                    const token = get().token || localStorage.getItem("token");
                    if (token) {
                        try {
                            const res = await axiosInstance.get<AuthResponse>("/auth/check", {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            localStorage.setItem("authUser", JSON.stringify(res.data));
                            set({ 
                                authUser: res.data, 
                                token, 
                                isCheckingAuth: false 
                            });
                            return;
                        } catch (backendError: any) {
                            if (backendError.response?.status !== 404) {
                                console.log("Backend auth failed.");
                            }
                            // Clear invalid/stale backend auth artifacts.
                            localStorage.removeItem("token");
                            localStorage.removeItem("authUser");
                            set({ authUser: null, token: null });
                        }
                    }

                    set({ 
                        authUser: null, 
                        token: null, 
                        isCheckingAuth: false 
                    });
                } catch (error: any) {
                    console.error("Error checking auth:", error);
                    localStorage.removeItem("token");
                    localStorage.removeItem("authUser");
                    set({ 
                        authUser: null, 
                        token: null, 
                        isCheckingAuth: false 
                    });
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
                        // Set JWT in cookies for middleware
                        document.cookie = `jwt=${token}; path=/; max-age=86400`;
                        set({ token });
                    }

                    void upsertAuthProviderByEmail({
                        email: res.data.email,
                        role: res.data.role || data.role,
                        authProvider: "email",
                    }).catch((providerError) => {
                        console.error("Auth provider sync failed after signup:", providerError);
                    });
                    
                    set({ authUser: res.data });
                    toast.success("Account created successfully.");
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Signup failed.");
                } finally {
                    set({ isSigningUp: false });
                }
            },

            signupWithGoogle: async (role: string) => {
                set({ isGoogleSigningIn: true });
                try {
                    const provider = new GoogleAuthProvider();
                    provider.setCustomParameters({
                        prompt: "select_account",
                    });

                    const result = await signInWithPopup(firebaseAuth, provider);
                    const firebaseToken = await result.user.getIdToken();

                    const res = await axiosInstance.post<AuthResponse>("/auth/google", {
                        token: firebaseToken,
                        role,
                    });

                    const authToken = res.data.token;
                    if (authToken) {
                        localStorage.setItem("token", authToken);
                        localStorage.setItem("authUser", JSON.stringify(res.data));
                        document.cookie = `jwt=${authToken}; path=/; max-age=86400`;
                        set({ token: authToken });
                    }

                    void upsertAuthProviderByEmail({
                        email: res.data.email,
                        role: res.data.role || role,
                        authProvider: "google",
                        firebaseUid: result.user.uid,
                    }).catch((providerError) => {
                        console.error("Auth provider sync failed after Google signup:", providerError);
                    });

                    set({ authUser: res.data });
                    toast.success("Google sign-in successful.");
                } catch (error: any) {
                    const message = error?.response?.data?.message || "Google sign-in failed.";
                    toast.error(message);
                    throw error;
                } finally {
                    set({ isGoogleSigningIn: false });
                }
            },

            loginWithGoogle: async (role: string) => {
                set({ isGoogleSigningIn: true });
                try {
                    const provider = new GoogleAuthProvider();
                    provider.setCustomParameters({
                        prompt: "select_account",
                    });

                    const result = await signInWithPopup(firebaseAuth, provider);
                    const firebaseToken = await result.user.getIdToken();

                    const res = await axiosInstance.post<AuthResponse>("/auth/google", {
                        token: firebaseToken,
                        role,
                    });

                    const authToken = res.data.token;
                    if (authToken) {
                        localStorage.setItem("token", authToken);
                        localStorage.setItem("authUser", JSON.stringify(res.data));
                        document.cookie = `jwt=${authToken}; path=/; max-age=86400`;
                        set({ token: authToken });
                    }

                    void upsertAuthProviderByEmail({
                        email: res.data.email,
                        role: res.data.role || role,
                        authProvider: "google",
                        firebaseUid: result.user.uid,
                    }).catch((providerError) => {
                        console.error("Auth provider sync failed after Google login:", providerError);
                    });

                    set({ authUser: res.data });
                    toast.success("Logged in with Google.");
                } catch (error: any) {
                    throw error;
                } finally {
                    set({ isGoogleSigningIn: false });
                }
            },

            getLoginAuthProvider: async (email: string) => {
                try {
                    return await getAuthProviderByEmail(email);
                } catch (error) {
                    console.error("Error checking auth provider:", error);
                    return null;
                }
            },

            getCachedLoginAuthProvider: (email: string) => {
                return getCachedAuthProviderByEmail(email);
            },

            login: async (data: LoginData) => {
                set({ isLoggingIn: true });
                try {
                    const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
                    const token = res.data.token;

                    if (token) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("authUser", JSON.stringify(res.data));
                        // Set JWT in cookies for middleware
                        document.cookie = `jwt=${token}; path=/; max-age=86400`;
                        set({ token });
                    }
                    
                    set({ authUser: res.data });
                } catch (error: any) {
                    throw error;
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
                    // Clear JWT cookie
                    document.cookie = "jwt=; path=/; max-age=0";
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

                    const updatedAuthUser = {
                        ...res.data,
                        token: token,
                    };
                    
                    // Update localStorage
                    localStorage.setItem("authUser", JSON.stringify(updatedAuthUser));
                    
                    set({ authUser: updatedAuthUser });
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
