"use client";
import React, { useRef, useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import emailjs from "@emailjs/browser";

import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';

const contactPage = () => {
    const form = useRef(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
                form.current,
                {
                    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ""
                }
            )
            .then(() => {
                console.log("success!");
                setMessage("Message send successfully!");
                form.current?.reset();
                setLoading(false);
            }, (error) => {
                console.log("failed...", error.text);
                setMessage("failed to send message. please try again...");
                setLoading(false);
            });
    };

    return (
        <div className='flex flex-col min-h-screen bg-white'>
            < Navbar />

            <div className="flex-1 max-w-6xl mx-auto py-10 px-6">
                <div className='text-center mb-4'>
                    <h1 className="inline-block text-2xl font-bold mb-4  text-gray-900 rounded-2xl border px-4 py-2">
                        Contact Us!
                    </h1>
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col justify-start space-y-6 text-center items-center pt-10">
                    <p className="text-xl text-gray-600 max-w-3xl">
                        Welcome to our Contact Page. If you face any issues or have questions 
                        regarding this platform, feel free to reach out to us. <br />
                        Our team will be happy to assist you.
                    </p>
                    <div className="flex flex-col items-center space-x-6 space-y-3 text-lg text-gray-800 pt-8 justify-center md:justify-start">
                        <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-700" />
                        <span>+91 00000 00000</span>
                        </div>
                        <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-700" />
                        <a href="mailto:easyhiredesk@gmail.com" className="font-semibold text-black underline">
                            easyhiredesk@gmail.com
                        </a>
                        </div>
                    </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl">
                    <form ref={form} onSubmit={sendEmail} className="space-y-5">
                        <div>
                        <label className="block text-black font-medium mb-1">Name</label>
                        <input 
                            type="text"
                            name="name"
                            placeholder="Enter your name" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                        />
                        </div>
                        <div>
                        <label className="block text-black font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Enter your email" 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                        />
                        </div>
                        <div>
                            <label className="block text-black font-medium mb-1">Subject</label>
                            <input
                                type="subject"
                                name="title"
                                placeholder="Enter your subject"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                            />
                        </div>
                        <div>
                        <label className="block text-black font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            placeholder="Write your message..."
                            required
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-400 focus:outline-none"
                        ></textarea>
                        </div>
                        {message && (
                            <p className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </p>
                        )}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition border"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                    </div>
                </div>
            </div>

            < FooterLogin />
        </div>
    )
}

export default contactPage;