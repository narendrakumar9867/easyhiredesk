"use client";
import { useAuth } from "@/src/hooks/useAuth"
import { ChangeEvent, useState } from "react";
import { Camera, Mail } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import FooterLogin from "@/src/components/FooterLogin";

export default function ProfilePage() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuth();
    const [ selectedImg, setSelectedImg] = useState<string>("");
    const { logout } = useAuth();

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];

        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (): Promise<void> => {
            const base64Image = reader.result;
            if(typeof base64Image === "string") {
                setSelectedImg(base64Image);
                await updateProfile({ profilePic: base64Image});
            }
        }
    }

    function handleLogout() {
        logout();
    }

    return(
        <div className="flex flex-col min-h-screen bg-white">
            < Navbar />

            <div className="h-screen pt-20">
                <div className="max-w-2xl mx-auto p-4 py-8">
                    <div className="bg-base-300 rounded-xl p-6 space-y-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold">Profile</h1>
                            <p className="mt-2">Your profile information</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <img
                                    src={selectedImg || authUser?.profilePic || "/images/avatar.png"}
                                    alt="Profile"
                                    className="size-32 rounded-full object-cover border-4" 
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                                >
                                    <Camera className="w-5 h-5 text-base-200" />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUpdatingProfile}
                                    />
                                </label>
                            </div>
                            
                            <p className="text-sm text-zinc-400 text-center">
                                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                        </div>

                        <div className="flex-1 text-center">
                            <button
                            onClick={() => {
                                handleLogout();
                                window.location.href = "/";
                            }}
                            className="border-black w-fit rounded-xl border-2 bg-black px-4 py-2 text-white transition-all hover:bg-transparent hover:text-black/90 mr-3"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            < FooterLogin />
        </div>     
    )
};

