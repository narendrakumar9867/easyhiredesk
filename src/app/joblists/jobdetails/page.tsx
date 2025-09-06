"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function JobDetailsPage() {
    const [selectedRound, setSelectedRound] = useState(1);
    
    const jobData = {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        location: 'New York',
        type: 'Full-time',
        salary: '$80,000 - $120,000',
        description: `We are looking for a skilled Frontend Developer to join our dynamic team. The ideal candidate will have experience with modern JavaScript frameworks and a passion for creating exceptional user experiences.

        Key Responsibilities:
        • Develop and maintain user-facing web applications
        • Collaborate with design and backend teams
        • Optimize applications for maximum speed and scalability
        • Ensure cross-browser compatibility
        • Write clean, maintainable code

        Requirements:
        • 3+ years of experience in frontend development
        • Proficiency in React.js, HTML5, CSS3, JavaScript
        • Experience with responsive design
        • Knowledge of version control systems (Git)
        • Strong problem-solving skills

        Benefits:
        • Competitive salary and performance bonuses
        • Flexible working hours and remote work options
        • Comprehensive health insurance
        • Professional development opportunities
        • Modern office environment with latest tech`,
        rounds: [
            { 
                id: 1, 
                name: 'Round 1', 
                status: 'pending', 
                title: 'Initial Screening',
                description: 'HR screening call to discuss your background, experience, and interest in the role. This is a 30-minute conversation to get to know you better.',
                duration: '30 minutes',
                type: 'Phone/Video Call'
            },
            { 
                id: 2, 
                name: 'Round 2', 
                status: 'pending', 
                title: 'Technical Assessment',
                description: 'Comprehensive technical evaluation including coding challenges, system design questions, and live coding session.',
                duration: '90 minutes',
                type: 'Online Assessment'
            },
            { 
                id: 3, 
                name: 'Round 3', 
                status: 'pending', 
                title: 'Final Interview',
                description: 'Final interview with team leads, cultural fit assessment, and discussion about role expectations and career growth.',
                duration: '60 minutes',
                type: 'In-person/Video'
            }
        ]
    };

    const renderRoundContent = () => {
        const currentRound = jobData.rounds.find(round => round.id === selectedRound);
        
        if (selectedRound === 1) {
            return (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Overview</h3>
                        
                        {/* Job Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Company</span>
                                    <p className="text-gray-800 text-lg">{jobData.company}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Location</span>
                                    <p className="text-gray-800 text-lg">{jobData.location}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Job Type</span>
                                    <p className="text-gray-800 text-lg">{jobData.type}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className="text-gray-600 font-medium block mb-1">Salary Range</span>
                                    <p className="text-gray-800 text-lg">{jobData.salary}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job Description */}
                    <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h4>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {jobData.description}
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
                            <h5 className="font-semibold text-gray-800">Assessment includes:</h5>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>JavaScript/React coding challenges</li>
                                <li>Algorithm and data structure problems</li>
                                <li>System design discussion</li>
                                <li>Code review exercises</li>
                                <li>Best practices and optimization questions</li>
                            </ul>
                        </div>
                    )}
                    
                    {selectedRound === 3 && (
                        <div className="space-y-4">
                            <h5 className="font-semibold text-gray-800">Interview focus areas:</h5>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Team collaboration and communication skills</li>
                                <li>Problem-solving approach and methodology</li>
                                <li>Career goals and professional development</li>
                                <li>Company culture fit and values alignment</li>
                                <li>Questions about the role and team dynamics</li>
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-yellow-700">
                                <strong>Status:</strong> {currentRound?.status === 'pending' ? 'Pending - You will be notified when this round is scheduled.' : currentRound?.status}
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
                        <span>Back to Job Lists</span>
                    </Link>

                    
                {/* Job Title */}
                <div className="flex items-center space-x-2 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        <h1 className="text-xl font-semibold">{jobData.title}</h1>
                </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar - Job Application Stages */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg sticky top-8">
                            <h2 className="text-white text-lg font-semibold mb-6">Job Application Process</h2>
                            
                            <div className="space-y-2">
                                {jobData.rounds.map((round, index) => (
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
                                            <div className="text-sm opacity-75 mt-1">{round.title}</div>
                                        </button>
                                        
                                        <div className={`text-center mt-2 text-sm ${
                                            round.status === 'pending' ? 'text-yellow-400' : 
                                            round.status === 'completed' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {round.status}
                                        </div>
                                        
                                        {/* Connection line */}
                                        {index < jobData.rounds.length - 1 && (
                                            <div className="flex justify-center my-3">
                                                <div className="w-0.5 h-6 bg-gray-600"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Job Information */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Tab Header */}
                            <div className="bg-gray-800 text-white rounded-t-lg px-6 py-4">
                                <h2 className="text-xl font-semibold">All About The Job</h2>
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