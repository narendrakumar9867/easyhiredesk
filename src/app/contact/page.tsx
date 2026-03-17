"use client";

import React, { useRef, useState } from "react";
import { Mail, MessageCircleMore, Phone, ShieldCheck } from "lucide-react";
import emailjs from "@emailjs/browser";

import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import FAQ from "@/src/sections/FAQ";

export default function ContactPage() {
    const form = useRef<HTMLFormElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.current) return;

        setLoading(true);
        setMessage("");

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
                form.current,
                {
                    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
                }
            )
            .then(
                () => {
                    setMessage("Message sent successfully.");
                    form.current?.reset();
                    setLoading(false);
                },
                (error) => {
                    console.log("failed...", error.text);
                    setMessage("Failed to send message. Please try again.");
                    setLoading(false);
                }
            );
    };

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
                <Navbar />
            </div>

            <main className="flex-1 px-4 pb-10 pt-18 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-7xl rounded-[2rem] border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-6 sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="space-y-6">
                            <span className="inline-flex items-center rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
                                Contact EasyhireDesk
                            </span>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-serif tracking-tight sm:text-5xl">
                                    Talk to our team and get support quickly.
                                </h1>
                                <p className="max-w-xl text-base leading-7 text-neutral-600">
                                    If you have questions about jobs, applications, rounds, or account setup,
                                    send us message. We will respond as soon as possible.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-neutral-700" />
                                        <div>
                                            <p className="text-sm text-neutral-500">Phone</p>
                                            <p className="font-semibold text-black">+91 00000 00000</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-neutral-700" />
                                        <div>
                                            <p className="text-sm text-neutral-500">Email</p>
                                            <a
                                                href="mailto:easyhiredesk@gmail.com"
                                                className="font-semibold text-black underline underline-offset-2"
                                            >
                                                easyhiredesk@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:col-span-2">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 text-neutral-700" />
                                        <p className="text-sm leading-6 text-neutral-600">
                                            We use secure messaging providers for form delivery. Please add clear
                                            subject and details so we can help faster.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-neutral-100 p-2">
                                    <MessageCircleMore className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-semibold">Send us message</h2>
                            </div>

                            <form ref={form} onSubmit={sendEmail} className="space-y-5">
                                <div>
                                    <label className="mb-1 block font-medium text-black">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-black">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-black">Subject</label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Enter your subject"
                                        required
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-black">Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Write your message"
                                        rows={5}
                                        required
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-black focus:outline-none"
                                    />
                                </div>

                                {message && (
                                    <p
                                        className={`text-sm font-medium ${
                                            message.includes("success") ? "text-neutral-700" : "text-red-600"
                                        }`}
                                    >
                                        {message}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-black bg-black px-5 py-3 font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
                    <FAQ />
                </section>
            </main>

            <Footer />
        </div>
    );
}