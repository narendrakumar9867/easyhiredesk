"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";

export default function CandidateJobDetailsPage() {
    const params = useParams();
    const applicationId = params?.id; // This is now application ID, not job ID
    const { authUser, token } = useAuth();
    const [selectedRound, setSelectedRound] = useState(1);
    const [applicationData, setApplicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
            } catch (error) {
                console.error("Error fetching application data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
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
    const applicationRounds = [
        { 
            id: 1, 
            name: 'Round 1', 
            status: 'pending',
            title: 'Application Review',
            description: 'Your application has been submitted and is under review by the HR team.',
            duration: 'N/A',
            type: 'Document Review',
        },
        { 
            id: 2, 
            name: 'Round 2', 
            status: 'pending',
            title: 'HR Screening Call',
            description: 'HR screening call to discuss your background, experience, and interest in the role.',
            duration: '30 minutes',
            type: 'Phone/Video Call',
        },
        { 
            id: 3, 
            name: 'Round 3', 
            status: 'pending',
            title: 'Technical Assessment',
            description: 'Comprehensive technical evaluation including coding challenges and system design.',
            duration: '90 minutes',
            type: 'Online Assessment',
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'in-progress': return 'text-blue-400';
            case 'rejected': return 'text-red-400';
            case 'pending': default: return 'text-yellow-400';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'in-progress': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const renderRoundContent = () => {
        const currentRound = applicationRounds.find(round => round.id === selectedRound);
        
        if (selectedRound === 1) {
            return (
                <div className="space-y-6">
                    {/* Application Status Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {applicationData.roundNumber || 1}
                                </div>
                                <div className="text-sm text-gray-600">Current Round</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-3xl font-bold capitalize ${
                                    applicationData.status === 'selected' ? 'text-green-600' :
                                    applicationData.status === 'rejected' ? 'text-red-600' :
                                    'text-yellow-600'
                                }`}>
                                    {applicationData.status || 'Pending'}
                                </div>
                                <div className="text-sm text-gray-600">Application Status</div>
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
                        </div>
                    </div>
                    
                    {/* Job Description */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {jobData.aboutJob}
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
                                {applicationData.reviewedAt && (
                                    <div>
                                        <span className="text-gray-600 font-medium">Last Reviewed: </span>
                                        <span className="text-gray-800">
                                            {new Date(applicationData.reviewedAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {applicationData.notes && (
                                    <div>
                                        <span className="text-gray-600 font-medium">Notes: </span>
                                        <p className="text-gray-800 mt-1">{applicationData.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentRound?.title}</h3>
                    <div className="flex items-center space-x-4 mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBgColor(currentRound?.status)}`}>
                            {currentRound?.status?.replace('-', ' ').toUpperCase()}
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
                    
                    {selectedRound === 2 && (
                        <div className="space-y-4">
                            <h5 className="font-semibold text-gray-800">Preparation Tips:</h5>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Review your resume and be ready to discuss your experience</li>
                                <li>Research the company and role thoroughly</li>
                                <li>Prepare questions about the team and company culture</li>
                                <li>Ensure good internet connection for video call</li>
                            </ul>
                        </div>
                    )}
                    
                    {selectedRound === 3 && (
                        <div className="space-y-4">
                            <h5 className="font-semibold text-gray-800">Assessment areas:</h5>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Technical skills relevant to the role</li>
                                <li>Problem-solving and analytical thinking</li>
                                <li>Coding best practices and clean code</li>
                                <li>System design concepts</li>
                                <li>Technology stack knowledge</li>
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className={`border-l-4 p-4 rounded-r-lg bg-yellow-50 border-yellow-400`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-yellow-700">
                                <strong>Status:</strong> This round is currently pending. You will be notified when it's scheduled.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/joblists" className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Applied Jobs</span>
                    </Link>

                    <div className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        <h1 className="text-xl font-semibold">{jobData.jobTitle}</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar - Application Progress */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg sticky top-8">
                            <h2 className="text-white text-lg font-semibold mb-6">{jobData.jobTitle}</h2>
                            
                            <div className="space-y-2">
                                {applicationRounds.map((round, index) => (
                                    <div key={round.id} className="relative">
                                        <button 
                                            onClick={() => setSelectedRound(round.id)}
                                            className={`w-full text-left rounded-lg px-4 py-3 transition-all duration-200 ${
                                                selectedRound === round.id 
                                                    ? 'bg-black text-white shadow-md transform scale-105' 
                                                    : 'bg-gray-700 hover:bg-gray-600 text-white hover:transform hover:scale-102'
                                            }`}
                                        >
                                            <div className="font-medium">{round.name}</div>
                                        </button>
                                        
                                        <div className={`text-center mt-2 text-sm font-semibold ${getStatusColor(round.status)}`}>
                                            {round.status.replace('-', ' ').toUpperCase()}
                                        </div>
                                        
                                        {/* Connection line */}
                                        {index < applicationRounds.length - 1 && (
                                            <div className="flex justify-center my-3">
                                                <div className={`w-0.5 h-6 ${
                                                    round.status === 'completed' ? 'bg-green-400' : 'bg-gray-600'
                                                }`}></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Application Information */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Tab Header */}
                            <div className="bg-gray-800 text-white rounded-t-lg px-6 py-4">
                                <h2 className="text-xl font-semibold">All about the jobs</h2>
                            </div>
                            
                            {/* Content Area */}
                            <div className="p-8">
                                {renderRoundContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}