"use client";
{/*
  Steps for building the page:

  Step 1: Add the navbar and footer.  

  Step 2: Display the hiring process from top to bottom:  
          hireProcess → selectionProcess → rounds.  

  Step 3: Redirect to the home page → go to job posting → share the job to the desired platform.  

  Step 4: When viewing a specific job, display:  
          - Job details  
          - Rounds & round details  
          - services: job close (auto timer, immediate close, delete).  

  Step 5: Round 1 (common for all job postings):  
          - Show total applicants and candidate details.  
          - Each candidate section has two buttons: Select / Reject.  
          - On click: selection/rejection is updated & email is automatically sent to the candidate (selected / not selected).  

  Step 6: If a candidate is selected in Round 1, they are automatically moved to Round 2.  
          - Candidates can also view Round 2 once they progress.  

  Step 7: Future goal → AI chatbot support for both hiring managers and candidates.  
*/}

import React from 'react';
import { CheckCircle, Users, FileText, Eye, ArrowRight } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';


const processSteps = [
  {
    title: "Job Creation",
    description:
      "From the home page, go to the 'Hire Next Candidates' button and fill in the required job posting details. Provide Basic Information (company name, job title, location, company website, and social media links). In the 'About Job' section, add all relevant job information.",
    icon: <FileText className="w-6 h-6" />,
    services: ["Job Posting", "Job Information"],
  },
  {
    title: "Rounds Selection Stage",
    description:
      "Here you can define how many rounds will be conducted for hiring candidates. Simply choose the number of rounds required.",
    icon: <Users className="w-6 h-6" />,
    services: ["Round Selection"],
  },
  {
    title: "Rounds Details Stage",
    description:
      "In this stage, you can add details for each round. Note that Round 1 is fixed for any job creation and includes candidate details like name, phone number, and email ID. For each round, you can specify the title, email for selected candidates, and a separate email for non-selected candidates.",
    icon: <Eye className="w-6 h-6" />,
    services: ["Round Details", "Candidate Emails"],
  },
  {
    title: "Round 1 - Primary Selection",
    description: "Conduct initial interviews or assessments. Select promising candidates and automatically send rejection emails to unsuccessful applicants.",
    icon: <CheckCircle className="w-6 h-6" />,
    services: ["Candidate evaluation", "Select/Reject workflow", "Automated email notifications"]
  },
  {
    title: "Round 2 - Advanced Assessment",
    description: "Automatically progress qualified candidates from Round 1. Candidates can view their status and upcoming interview schedules.",
    icon: <ArrowRight className="w-6 h-6" />,
    services: ["Auto-progression", "Status visibility", "Interview scheduling"]
  },
  {
    title: "Final Decision & Onboarding",
    description: "Make final hiring decisions and begin the onboarding process for selected candidates with automated documentation.",
    icon: <Users className="w-6 h-6" />,
    services: ["Decision tracking", "Onboarding automation", "Documentation"]
  },
];

const HireManagerPage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        < Navbar />
      </div>

      <div className="flex-1 max-w-full mx-auto py-12 px-6 pt-28">
        <div className="text-center mb-16">
          <h1 className="inline-block text-2xl font-bold mb-4 rounded-2xl border px-4 py-2">
            Hire Manager Process
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamlined recruitment workflow designed to efficiently manage candidates 
            from application to onboarding with automated processes.
          </p>
        </div>

        <div className="relative">
          <div className="space-y-6">
              {processSteps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-3 pt-7 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {index < processSteps.length - 1 && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 z-0">
                    <svg width="200" height="80" className="overflow-visible">
                      <path
                        d={`M 100 0 Q ${index % 2 === 0 ? '150' : '50'} 450 100 80`}
                        stroke="#000000"
                        strokeWidth="2"
                        fill="none"
                        className="animate-pulse opacity-60"
                      />
                    </svg>
                  </div>
                )}
                <div className={`flex-1 ${index % 2 === 0 ? 'pr-6' : 'pl-6'} relative z-10`}>
                  <div 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
                  >
                    <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-start' : 'justify-start'}`}>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className={`text-gray-600 mb-4 leading-relaxed ${
                      index % 2 === 0 ? 'text-left' : 'text-left'
                    }`}>
                      {step.description}
                    </p>

                    <div className={`${index % 2 === 0 ? 'text-left' : 'text-left'}`}>
                      <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                      <div className={`flex flex-wrap gap-2 ${
                        index % 2 === 0 ? 'justify-start' : 'justify-start'
                      }`}>
                        {step.services.map((feature, featureIndex) => (
                          <span
                            key={featureIndex}
                            className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center justify-center">
                    {React.cloneElement(step.icon, { className: "bg-white rounded-full w-44 h-32 shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>       
      </div>

      < Footer />
    </div>
  );
};

export default HireManagerPage;