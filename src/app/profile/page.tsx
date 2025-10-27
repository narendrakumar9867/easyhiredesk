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
        <div className="flex flex-col min-h-screen bg-white">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
                < Navbar />
            </div>

            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
                        <h2 className="text-xl font-semibold mb-4">Crop Photo</h2>
                        <div className="relative h-96 bg-gray-100 rounded-lg">
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
                                <label className="text-sm text-gray-600">Zoom</label>
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
                                    className="px-4 py-2 border-2 rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createCroppedImage}
                                    disabled={isUpdatingProfile}
                                    className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
                                >
                                    {isUpdatingProfile ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <div className="h-screen pt-28">
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

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Role
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.role}</p>
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

