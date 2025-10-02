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
    closeDate?: string;
    isClosed?: string;
}

interface Application {
    _id: string;
    jobId: Job;
    candidateEmail: string;
    candidateName: string;
    status: string; //  'selected', 'Pending' ,'Rejected'
    roundStatuses?: {
        round: number;
        status: "pending" | "selected" | "rejected";
    }[];
    submittedAt: string;
    responses: any[];
}

export default function JobListsPage() {
    const { authUser, token } = useAuth();
    const role = authUser?.role;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobFilter, setJobFilter] = useState<"all" | "open" | "closed">("all");
    const [applicationFilter, setApplicationFilter] = useState<"all" | "selected" | "pending" | "rejected" | "in-progress">("all"); 

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

                // Fetch candidate's applications
                const response = await axiosInstance.get("/jobs/my-applications", config);
                console.log('Applications response received:', response.data);
                
                if (response.data.applications && response.data.applications.length > 0) {
                    setApplications(response.data.applications);
                } else {
                    setApplications([]);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };

        if (token && role === 'candidate') {
            fetchApplications();
        } else {
            setLoading(false);
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
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'selected':
            case "accepted":
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getOverallApplicationStatus = (application: Application) => {
        console.log("=== APPLICATION DEBUG ===");
        console.log("Application:", application);
        console.log("Main status:", application.status);
        console.log("Round statuses:", application.roundStatuses);
        
        if (!application || !application.jobId) return "pending";
        
        // If main application status is rejected, return rejected
        if (application.status?.toLowerCase() === 'rejected') {
            console.log("Returning rejected - main status");
            return "rejected";
        }
        
        // Check if we have roundStatuses array
        if (application.roundStatuses && Array.isArray(application.roundStatuses) && application.roundStatuses.length > 0) {
            console.log("Has round statuses, processing...");
            
            let selectedCount = 0;
            let rejectedCount = 0;
            
            application.roundStatuses.forEach((roundStatus, index) => {
                console.log(`Round ${roundStatus.round}:`, roundStatus.status);
                if (roundStatus.status === "selected" || roundStatus.status === "completed") {
                    selectedCount++;
                } else if (roundStatus.status === "rejected") {
                    rejectedCount++;
                }
            });
            
            console.log(`Selected: ${selectedCount}, Rejected: ${rejectedCount}, Total rounds: ${application.roundStatuses.length}`);
            
            // If any round is rejected, overall status is rejected
            if (rejectedCount > 0) {
                console.log("Returning rejected - round rejected");
                return "rejected";
            }
            
            // If all rounds are selected, overall status is selected
            if (selectedCount === application.roundStatuses.length) {
                console.log("Returning selected - all rounds selected");
                return "selected";
            }
            
            // If some rounds are selected but not all, status is in-progress
            if (selectedCount > 0) {
                console.log("Returning in-progress - some rounds selected");
                return "in-progress";
            }
            
            console.log("Returning pending - no rounds selected");
            return "pending";
        }
        
        // Fallback to main application status
        const mainStatus = application.status?.toLowerCase();
        console.log("Using main status fallback:", mainStatus);
        
        switch (mainStatus) {
            case 'selected':
            case 'accepted':
                return "selected";
            case 'rejected':
                return "rejected";
            case 'in-progress':
            case 'reviewed':
                return "in-progress";
            case 'pending':
            default:
                return "pending";
        }
    };

    const getRoundStatusForApplication = (application: Application, roundId: number) => {
    if(roundId === 0) {
        return "completed";
    }

    // Check if we have roundStatuses array
    if(application.roundStatuses && Array.isArray(application.roundStatuses)) {
        const roundStatus = application.roundStatuses.find(rs => rs.round === roundId);
        if(roundStatus) {
            return roundStatus.status;
        }
    }

    // Fallback for round 1 to main status
    if(roundId === 1) {
        return application.status || "pending";
    }

    return "pending";
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
                    <Link href="/auth/login" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    const filteredJobs = jobs.filter(job => {
        if(jobFilter === "all") return true;
        if(jobFilter === "open") {
            if(job.isClosed) return false;
            if(job.closeDate && new Date(job.closeDate) <= new Date()) return false;
        }
        if(jobFilter === "closed") {
            return job.isClosed || (job.closeDate && new Date(job.closeDate) <= new Date());
        }
        return true;
    })

    const filteredApplications = applications.filter(application => {
        if(applicationFilter === "all") return true;
        const status = getOverallApplicationStatus(application);
        return status === applicationFilter;
    })

    // Hire Manager View
    if (role === "hire_manager") {
        console.log("Rendering hire manager view for role:", role);
        return (
            <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
                < Navbar />
                <div className="max-w-full px-9 py-4 flex-1">
                    <div className="flex flex-col items-center justify-between mb-8">
                        <h1 className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                            <div className="font-semibold">My Posted Jobs</div>
                        </h1>
                    </div>

                    <div className='rounded-lg border p-4 mb-6 bg-white'>
                        <div className='flex items-center space-x-4'>
                            <span className='font-medium text-gray-700'>Filter Jobs:</span>
                            <div className='flex space-x-2'>
                                <button
                                    onClick={() => setJobFilter("all")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${jobFilter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                >
                                    All Jobs ({jobs.length})
                                </button>
                                <button
                                    onClick={() => setJobFilter("open")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${jobFilter === "open" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                >
                                    Open Jobs
                                </button>
                                <button
                                    onClick={() => setJobFilter("closed")}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${jobFilter === "closed" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                >
                                    Closed Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 p-6">
                        {jobs.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-gray-600">No jobs posted yet.</p>
                                <Link href="/hireprocess" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                                    Post New Job
                                </Link>
                            </div>
                        ) : (
                            filteredJobs.map((job, index) => (
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
                <div className="flex flex-col items-center justify-between mb-8">                
                    <h1 className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        <div className="font-semibold">My Applied Jobs</div>
                    </h1>
                </div>

                <div className='rounded-lg border p-4 mb-6 bg-white'>
                    <div className='flex items-center space-x-4'>
                        <span className='font-medium text-gray-700'>Filter Applications:</span>
                        <div className='flex space-x-2'>
                            <button
                               onClick={() => setApplicationFilter("all")}
                               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${applicationFilter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                All Applications ({applications.length})
                            </button>
                            <button
                               onClick={() => setApplicationFilter("pending")}
                               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${applicationFilter === "pending" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Pending
                            </button>
                            <button
                               onClick={() => setApplicationFilter("selected")}
                               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${applicationFilter === "selected" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Selected
                            </button>
                            <button
                               onClick={() => setApplicationFilter("rejected")}
                               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${applicationFilter === "rejected" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Rejected
                            </button>
                            <button
                               onClick={() => setApplicationFilter("in-progress")}
                               className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${applicationFilter === "in-progress" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                In Progress
                            </button>
                        </div>
                    </div>
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
                        filteredApplications.map((application, index) => (
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
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getOverallApplicationStatus(application))}`}>
                                                {getOverallApplicationStatus(application).charAt(0).toUpperCase() + getOverallApplicationStatus(application).slice(1)}
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