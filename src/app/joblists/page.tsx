"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";

interface Job {
    _id: string;
    companyName: string;
    jobTitle: string;
    location: string;
    companyWebsite?: string;
    socialLinks?: any[];
    aboutJob: string;
    createdBy?: string; // Add this field
    createdAt?: string;
}

export default function JobListsPage() {
    const { authUser, token } = useAuth();
    const role = authUser?.role;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch jobs from API using axiosInstance with auth
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                if (!token) {
                    console.log('No token available');
                    setLoading(false);
                    return;
                }

                console.log('Token available, making request...');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                console.log('Making request to /my-jobs with config:', config);
                // Get user's jobs only
                const response = await axiosInstance.get('/jobs/my-jobs', config);
                console.log('Response received:', response.data);
                setJobs(response.data.jobs || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                console.error("Error response:", error.response);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if user is authenticated and is a hire_manager
        if (token && role === 'hire_manager') {
            fetchJobs();
        } else {
            setLoading(false);
        }
    }, [token, role]);

    useEffect(() => {
        console.log("Role in JobListsPage:", role);
        console.log("Token:", token ? "Present" : "Not present");
    }, [role, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading jobs...</div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!authUser || !token) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Please login to view your jobs</p>
                    <Link href="/login" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    // Hire Manager View
    if (role === "hire_manager") {
        console.log("Rendering hire manager view for role:", role);
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <Link href="/" className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                        </Link>
                        
                        <h1 className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                            <div className="font-semibold">My Posted Jobs</div>
                        </h1>
                    </div>
                    
                    <div className="space-y-4">
                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-600">No jobs posted yet.</p>
                                <Link href="/hireprocess" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                    Post New Job
                                </Link>
                            </div>
                        ) : (
                            jobs.map((job, index) => (
                                <div 
                                    key={job._id} 
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Left side - Job info */}
                                        <div className="flex-1">
                                            <div className="bg-gray-800 text-white rounded-lg px-6 py-4 inline-block min-w-[300px]">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                                                        <div className="text-sm text-gray-300 mt-1">
                                                            {job.companyName} • {job.location} • Full-time
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Link href={`/joblists/jobdetails-hire-manager/${job._id}`}>
                                                <button className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                        
                                        {/* Right side - Share link button */}
                                        <div className="ml-6">
                                            <div className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                                                <button 
                                                    onClick={() => {
                                                        const shareLink = `${window.location.origin}/joblists/apply/${job._id}`;
                                                        navigator.clipboard.writeText(shareLink);
                                                        alert('Job link copied to clipboard!');
                                                    }}
                                                    className="hover:text-blue-300 transition-colors duration-200"
                                                >
                                                    <div className="font-medium">share link</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // If user is not a hire_manager
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
            <div className="text-center">
                <p className="text-xl text-gray-600">Access denied. Only hire managers can view job listings.</p>
                <Link href="/" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                    Go Home
                </Link>
            </div>
        </div>
    );
}