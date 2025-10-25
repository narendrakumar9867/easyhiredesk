import FooterLogin from '@/src/components/FooterLogin';
import Navbar from '@/src/components/Navbar';
import React from 'react'

const aiAssistancePage = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br bg-white'>
        <Navbar />

        <div className='flex-1 max-w-full mx-auto py-12 px-6'>
            <div className='relative'>
                <div className='text-center mb-10'>
                    <h2 className='inline-block text-2xl font-bold mb-4 rounded-2xl border px-4 py-2'>
                        Coming Soon...
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Building AI-powered solutions to enhance recruitment efficiency and communication.
                    </p>
                </div>

                <div className='space-y-6 w-3xl'>
                    <div className='flex-1 relative z-10'>
                        <div 
                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                                AI Chatbot Integration
                            </h3>
                            </div>

                            <p className="text-gray-600 mb-4 leading-relaxed">
                            Introducing an intelligent AI-powered chatbot designed to revolutionize the hiring process by enabling seamless communication between managers and candidates. The chatbot will be available 24/7, offering instant responses to queries related to job details, interview schedules, and application status. It will act as a virtual recruitment assistant, providing personalized support to candidates at every stage while reducing the manual workload for managers through automated updates, reminders, and quick access to candidate information.
                            </p>

                            <div>
                            <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>AI-powered chat for quick and reliable interaction</li>
                                <li>Dedicated support for managers</li>
                                <li>Guidance and assistance for candidates</li>
                                <li>Automated FAQs and instant query resolution</li>
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <FooterLogin />
    </div>
  )
}

export default aiAssistancePage;