"use client";
import { useAuth } from "@/src/hooks/useAuth"
import { ChangeEvent, useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import Navbar from "@/src/components/Navbar";
import FooterLogin from "@/src/components/FooterLogin";
import Cropper from "react-easy-crop";

export default function ProfilePage() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuth();
    const [ selectedImg, setSelectedImg] = useState<string>("");
    const [showCropModal, setShowCropModal] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0});
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [zoom, setZoom] = useState(1);
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
                setShowCropModal(true);
            }
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const createCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(selectedImg, croppedAreaPixels);
            setSelectedImg(croppedImage);
            await updateProfile({ profilePic: croppedImage });
            setShowCropModal(false);
        } catch (e) {
            console.error(e);
        }
    };

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = new Image();
        image.src = imageSrc;

        return new Promise((resolve) => {
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx?.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );
                resolve(canvas.toDataURL("image/jpeg"));
            };
        });
    };

    function handleLogout() {
        logout();
    }

    return(
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8f6f2] text-neutral-900">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-14 top-24 h-64 w-64 rounded-full bg-[#d9eadf] blur-3xl" />
                <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#f0e3ce] blur-3xl" />
            </div>

            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
                < Navbar />
            </div>

            {showCropModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
                        <h2 className="mb-4 text-xl font-semibold text-[#1d1b18]">Crop Photo</h2>
                        <div className="relative h-96 rounded-xl border border-neutral-200 bg-gray-100">
                            <Cropper
                                image={selectedImg}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-sm text-neutral-600">Zoom</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setShowCropModal(false);
                                        setSelectedImg("");
                                    }}
                                    className="rounded-xl border border-neutral-300 px-4 py-2 font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createCroppedImage}
                                    disabled={isUpdatingProfile}
                                    className="rounded-xl bg-[#1f2321] px-4 py-2 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#2b312e] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUpdatingProfile ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="relative z-10 pt-18 pb-10">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                    <div className="mb-6 rounded-[1.5rem] border border-[#e7dfd3] bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
                        <span className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6548]">
                            Account Center
                        </span>
                        <h1 className="mt-4 text-4xl font-serif tracking-tight text-[#1d1b18]">Profile</h1>
                        <p className="mt-2 text-sm leading-6 text-neutral-600 sm:text-base">Manage your personal details and profile photo.</p>
                    </div>

                    <div className="space-y-8 rounded-[1.5rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_28px_60px_-44px_rgba(0,0,0,0.5)] sm:p-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="rounded-full bg-gradient-to-tr from-[#d9eadf] to-[#f2e4cd] p-1.5">
                                    <img
                                        src={selectedImg || authUser?.profilePic || "/images/avatar.png"}
                                        alt="Profile"
                                        className="h-32 w-32 rounded-full border-4 border-white object-cover shadow"
                                    />
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute bottom-1 right-1 rounded-full bg-[#1f2321] p-2.5 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e] cursor-pointer ${isUpdatingProfile ? "pointer-events-none animate-pulse" : ""}`}
                                >
                                    <Camera className="h-5 w-5" />
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

                            <p className="text-center text-sm text-neutral-500">
                                {isUpdatingProfile ? "Uploading profile photo..." : "Click the camera icon to update your photo"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5 rounded-xl border border-[#ece4d8] bg-[#fcfaf7] p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </div>
                            <p className="rounded-lg border border-[#e6ddcf] bg-white px-4 py-2.5 text-neutral-800">{authUser?.email}</p>
                            </div>

                            <div className="space-y-1.5 rounded-xl border border-[#ece4d8] bg-[#fcfaf7] p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                                <User className="h-4 w-4" />
                                Role
                            </div>
                            <p className="rounded-lg border border-[#e6ddcf] bg-white px-4 py-2.5 text-neutral-800 capitalize">{authUser?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            < FooterLogin />
        </div>     
    )
};

