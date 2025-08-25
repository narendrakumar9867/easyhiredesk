"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpVerifyPage({ email, onClose }: { email: string; onClose: () => void }) {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  // For demo, OTP = 12345
  const correctOtp = "12345";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === correctOtp) {
      alert("Login successful.");
      router.push("/");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter the OTP sent to <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
