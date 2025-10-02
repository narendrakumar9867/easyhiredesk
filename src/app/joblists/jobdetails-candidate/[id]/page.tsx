"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";
import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';
import renderMakrdown from '@/src/components/MarkdownRenderer';

export default function CandidateJobDetailsPage() {
    const params = useParams();
    const applicationId = params?.id; // This is now application ID, not job ID
    const { token } = useAuth();
    const [selectedRound, setSelectedRound] = useState(0);
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobRounds, setJobRounds] = useState(null);
    const [roundTitles, setRoundTitles] = useState<{[key: number]: string}>({});
    const [emailTemplate, setEmailTemplate] = useState(null);
    const [emailHistory, setEmailHistory] = useState([]);
    
    useEffect(() => {
        const fetchApplicationData = async () => {
            if (!token || !applicationId) {
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // Fetch application data - this should return application with populated job data
                const response = await axiosInstance.get(`/candidate/application/${applicationId}`, config);
                setApplicationData(response.data.application);

                console.log('Application data received:', response.data.application);
                console.log('Email history:', response.data.application.emailHistory);

                if(response.data.application && response.data.application.jobId && response.data.application.jobId._id) {
                    try {
                        const roundsResponse = await axiosInstance.get(`/rounds/${response.data.application.jobId._id}`, config);
                        if(roundsResponse.data && roundsResponse.data.data) {
                            setJobRounds(roundsResponse.data.data);
                        }
                    } catch (error: any) {
                        console.log("No rounds found for this job yet:", error.response?.data?.message);
                        setJobRounds(null);
                    }

                    try {
                        const emailDetailsResponse = await axiosInstance.get(`/rounds/${response.data.application.jobId._id}`, config);
                        if(emailDetailsResponse.data && emailDetailsResponse.data.data) {
                            setEmailTemplate(emailDetailsResponse.data.data);
                        }
                    } catch (error) {
                        console.log("No email templates found:", error);   
                    }
                } 
            } catch (error) {
                console.error("Error fetching application data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();

        const interval = setInterval(fetchApplicationData, 20000);
        return () => clearInterval(interval);
    }, [applicationId, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading application details...</div>
            </div>
        );
    }

    if (!applicationData || !applicationData.jobId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Application not found</p>
                    <Link href="/joblists" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors">
                        Back to Applied Jobs
                    </Link>
                </div>
            </div>
        );
    }

    const jobData = applicationData.jobId; // Job data is populated in the application object

    // Fixed rounds for now (will make dynamic later as you mentioned)
    const generateApplicationRounds = () => {
        const rounds = [
            { 
                id: 0, 
                name: 'Job Details', 
                title: 'Job Overview & Application Details',
                description: 'View complete job information and your application details.',
                duration: 'N/A',
                type: 'Overview',
            },
        ];

        if(jobRounds && jobRounds.selectedRounds && Array.isArray(jobRounds.selectedRounds)) {
            jobRounds.selectedRounds.forEach((roundData, index) => {
                rounds.push({
                    id: index + 1,
                    name: `Round ${index + 1}`,
                    title: roundData.title,
                    description: 'Here the mail from details share for this round',
                    duration: 'result date',
                    type: 'Interview Round',
                });
            });
        }
        return rounds;
    };

    const applicationRounds = generateApplicationRounds();

    const getOverallApplicationStatus = () => {
        const interviewRounds = applicationRounds.filter(round => round.id > 0);
        const totalRounds = interviewRounds.length;

        let selectedCount = 0;
        let rejectedCount = 0;
        let pendingCount = 0;

        for(let i = 1; i <= totalRounds; i++) {
            const status = getRoundStatus(i);

            if(status === "selected" || status === "completed") {
                selectedCount++;
            }
            else if(status === "rejected") {
                rejectedCount++;
            }
            else {
                pendingCount++;
            }
        }

        if(rejectedCount > 0) return "rejected";
            if(selectedCount === totalRounds) return "selected";
            if(selectedCount > 0) return "in-progress";
            return "pending";
    }

    const getButtonStatusColor = (roundId, isSelected) => {
        const status = getRoundStatus(roundId);

        if(isSelected) {
            return "bg-black text-white shadow-md transform scale-105";
        }

        switch (status) {
            case 'selected':
            case 'completed' : return 'bg-green-600 hover:bg-green-700 text-white hover:transform hover:scale-102';
            case 'rejected': return 'bg-red-600 hover:bg-red-700 text-white hover:transform hover:scale-102';
            case 'in-progress': return 'bg-blue-600 hover:bg-blue-700 text-white hover:transform hover:scale-102';
            case 'pending':
            default: return 'bg-gray-700 hover:bg-gray-600 text-white hover:transform hover:scale-102';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'completed': 
            case 'selected' : return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getRoundStatus = (roundId) => {
        if(roundId === 0) {
            return "completed";
        }

        // Check if we have roundStatuses array
        if(applicationData.roundStatuses && Array.isArray(applicationData.roundStatuses)) {
            const roundStatus = applicationData.roundStatuses.find(rs => rs.round === roundId);
            if(roundStatus) {
                return roundStatus.status;
            }
        }

        // Fallback for round 1 to main status
        if(roundId === 1) {
            return applicationData.status || "pending";
        }

        return "pending";
    };

    const getEmailForRoundAndStatus = (roundId, status) => {
        const emailRecord = applicationData.emailHistory?.find(email =>
            email.round === roundId && email.emailType === status  
        );

        if(emailRecord) {
            return{
                sent: true,
                sentAt: emailRecord.sentAt,
                sentBy: emailRecord.sentBy,
                messageId: emailRecord.messageId
            };
        }
        return { sent: false };
    };

    const renderEmailContent = (roundId) => {
        const currentStatus = getRoundStatus(roundId);
        const emailInfo = getEmailForRoundAndStatus(roundId, currentStatus);

        if(!emailInfo.sent) {
            return(
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">No email sent yet for this round.</p>
                </div>
            );
        }

        const isSelected = currentStatus === "selected";
        
        return(
            <div className={`border rounded-lg p-6 ${isSelected ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center justify-between mb-4">
                    <h5 className={`font-semibold ${isSelected ? 'text-green-800' : 'text-red-800'}`}>
                        {isSelected ? 'Selection' : 'Rejection'} Email Received
                    </h5>
                    <span className="text-sm text-gray-500">
                        {new Date(emailInfo.sentAt).toLocaleString()}
                    </span>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                        <strong>From:</strong> {emailInfo.sentBy || 'Hiring Team'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Status:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${isSelected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isSelected ? 'SELECTED' : 'NOT SELECTED'}
                        </span>
                    </p>
                    {isSelected ? (
                        <div className="mt-4 p-3 bg-white rounded border">
                            <p className="text-green-700">
                                Congratulations! You have been selected for the next round. 
                                You will be contacted soon with further details.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-4 p-3 bg-white rounded border">
                            <p className="text-red-700">
                                Thank you for your interest. After careful consideration, 
                                we have decided to move forward with other candidates.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderRoundContent = () => {
    const currentRound = applicationRounds.find(round => round.id === selectedRound);
    
        // Job Details and Application Overview (Round 0 or separate tab)
        if (selectedRound === 0) {
            return (
                <div className="space-y-6">
                    {/* Application Status Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {applicationRounds.length - 1}
                                </div>
                                <div className="text-sm text-gray-600">Total Round</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-3xl font-bold capitalize ${
                                    getOverallApplicationStatus() === "selected" ? "text-green-600" :
                                    getOverallApplicationStatus() === "rejected" ? "text-red-600" :
                                    getOverallApplicationStatus() === "in-progress" ? "text-blue-600" :
                                    "text-yellow-600"
                                    }`}>
                                    {getOverallApplicationStatus().charAt(0).toUpperCase() + getOverallApplicationStatus().slice(1)}
                                </div>
                                <div className="text-sm text-gray-600">Overall Application Status</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {new Date(applicationData.submittedAt).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-600">Applied Date</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Overview</h3>
                        
                        {/* Job Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Company</span>
                                    <p className="text-gray-800 text-lg">{jobData.companyName}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Location</span>
                                    <p className="text-gray-800 text-lg">{jobData.location}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Website</span>
                                    <p className="text-gray-800 text-lg">
                                        {jobData.companyWebsite ? (
                                            <a href={jobData.companyWebsite} target="_blank" rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline">
                                                {jobData.companyWebsite}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Posted On</span>
                                    <p className="text-gray-800 text-lg">
                                        {new Date(jobData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Social Links</span>
                                    <p className="text-gray-800 text-lg">
                                        {jobData.socialLinks ? (
                                            <a href={jobData.socialLinks} target="_blank" rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline">
                                                {jobData.socialLinks}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                        </div>
                    </div>
                    
                    {/* Job Description */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {renderMakrdown(jobData?.aboutJob || "")}
                            </div>
                        </div>
                    </div>

                    {/* Application Details */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Your Application Details</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-gray-600 font-medium">Name: </span>
                                    <span className="text-gray-800">{applicationData.candidateName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium">Email: </span>
                                    <span className="text-gray-800">{applicationData.candidateEmail}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-medium">Submitted: </span>
                                    <span className="text-gray-800">
                                        {new Date(applicationData.submittedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        // Interview Rounds (Round 1 onwards)
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentRound?.roundData?.title}</h3>
                    <div className="flex items-center space-x-4 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(getRoundStatus(selectedRound))}`}>
                            {getRoundStatus(selectedRound)?.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {currentRound?.duration}
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {currentRound?.type}
                        </span>
                    </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {currentRound?.description}
                    </p>
                    
                    <div className="space-y-4">
                        <h5 className="font-semibold text-gray-800">Communication Status</h5>
                        {renderEmailContent(selectedRound)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 max-w-full">
            < Navbar />
            <div className="max-w-full px-9 py-3 flex-1">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Application Progress */}
                    <div className="lg:col-span-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-9 py-2 rounded-md transition-colors duration-200">
                                <h1 className="text-xl font-semibold">{jobData.jobTitle}</h1>
                            </div>
                        </div>
                
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg sticky top-8">                        
                            <div className="space-y-2">
                                {applicationRounds.map((round) => (
                                    <div key={round.id} className="relative">
                                        <button 
                                            onClick={() => setSelectedRound(round.id)}
                                            className={`w-full text-left rounded-lg px-4 py-3 transition-all duration-200 ${
                                                getButtonStatusColor(round.id, selectedRound === round.id)}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{round.name}</div>
                                            </div>
                                        </button>
                                        
                                        {/* Connection line */}
                                        <div className="flex justify-center my-3">
                                            <div className="w-0.5 h-1"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Application Information */}
                    <div className="lg:col-span-3">
                        <div className="rounded-lg">
                            {/* Tab Header */}
                            <div className="bg-gray-800 text-white rounded-t-lg px-6 py-4">
                                <h2 className="text-xl font-semibold">
                                    {selectedRound === 0 ? "Job details & Application" : "Interview Rounds"}
                                </h2>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-8">
                                {renderRoundContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            < FooterLogin />
        </div>
    );
}