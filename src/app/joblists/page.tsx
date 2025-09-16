"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";
import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';

interface Job {
    _id: string;
    companyName: string;
    jobTitle: string;
    location: string;
    companyWebsite?: string;
    socialLinks?: any[];
    aboutJob: string;
    createdBy?: string;
    createdAt?: string;
}

interface Application {
    _id: string;
    jobId: Job;
    candidateEmail: string;
    candidateName: string;
    status: string; // 'pending', 'reviewed', 'accepted', 'rejected'
    submittedAt: string;
    responses: any[];
}

export default function JobListsPage() {
    const { authUser, token } = useAuth();
    const role = authUser?.role;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch jobs for hire managers
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
                const response = await axiosInstance.get('/jobs/my-jobs', config);
                console.log('Response received:', response.data);
                setJobs(response.data.jobs || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        if (token && role === 'hire_manager') {
            fetchJobs();
        } else {
            setLoading(false);
        }
    }, [token, role]);

    // Fetch applications for candidates
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (!token) {
                    console.log('No token available');
                    setLoading(false);
                    return;
                }

                console.log('Fetching applications for candidate...');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Assuming you have an endpoint to get candidate's applications
                const response = await axiosInstance.get("/jobs/my-applications", config);
                console.log('Applications response received:', response.data);
                setApplications(response.data.applications || []);
            } catch (error) {
                console.error("Error fetching applications:", error);
                console.error("Error response:", error.response);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (token && role === 'candidate') {
            fetchApplications();
        }
    }, [token, role]);

    useEffect(() => {
        console.log("Role in JobListsPage:", role);
        console.log("Token:", token ? "Present" : "Not present");
    }, [role, token]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
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
            <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
                < Navbar />
                <div className="max-w-full px-9 py-4 flex-1">
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
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 border border-gray-200"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Left side - Job info */}
                                        <div className="flex-1">
                                            <div className="bg-gray-800 text-white rounded-lg px-6 py-4 inline-block min-w-[400px]">
                                                <div className="flex items-center space-x-5">
                                                    <div className="bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                                                        <div className="text-sm text-gray-300 mt-1 flex gap-7">
                                                            <span>{job.companyName}</span> 
                                                            <span>{job.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Link href={`/joblists/jobdetails-hire-manager/${job._id}`}>
                                                <button className="bg-black hover:bg-gray-600 text-white px-7 py-4 rounded-md transition-colors duration-200">
                                                    View Job Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                </div>

                <div className="mt-auto">
                    <FooterLogin />
                </div>
            </div>  
        );
    }

    // Candidate View - Applied Jobs
    console.log("Rendering candidate view for role:", role);
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
            < Navbar />
            <div className="max-w-full px-9 py-4 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                    </Link>
                    
                    <h1 className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        <div className="font-semibold">My Applied Jobs</div>
                    </h1>
                </div>
                
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">No job applications yet.</p>
                            <p className="text-gray-500 mb-6">Start applying to jobs to see your applications here.</p>
                            <Link href="/" className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        applications.map((application, index) => (
                            <div 
                                key={application._id} 
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left side - Job info */}
                                    <div className="flex-1">
                                        <div className="bg-gray-800 text-white rounded-lg px-6 py-4 inline-block min-w-[400px]">
                                            <div className="flex items-center space-x-5">
                                                <div className="bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">{application.jobId.jobTitle}</h3>
                                                    <div className="text-sm text-gray-300 mt-1 flex gap-7">
                                                        <span>{application.jobId.companyName}</span> 
                                                        <span>{application.jobId.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Application details */}
                                        <div className="mt-3 ml-2 flex items-center space-x-4">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                Applied on {formatDate(application.submittedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side - Actions */}
                                    <div className="flex items-center space-x-2">
                                        <Link href={`/joblists/jobdetails-candidate/${application._id}`}>
                                            <button className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm">
                                                View Application
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-auto">
                <FooterLogin />
            </div>
        </div>
    );
}
