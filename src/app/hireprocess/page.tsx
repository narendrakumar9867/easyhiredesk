"use client";
import React, { useState } from 'react';
import { Eye, Edit, Building2, MapPin, Globe, Linkedin, Twitter, Plus, X, Save } from 'lucide-react';
import axios from "axios";

import Navbar from "@/src/components/Navbar";
import FooterLogin from '@/src/components/FooterLogin';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import renderMakrdown from '@/src/components/MarkdownRenderer';

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export default function JobDetailsPage() {
  const [activeTab, setActiveTab] = useState('edit');
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    companyWebsite: '',
    socialLinks: [] as SocialLink[],
    aboutJob: '',
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!token) {
      alert("You must be logged in to submit a job.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/jobs", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log("Job created response:", res.data);
      const jobId = res.data.job._id;

      router.push(`/hireprocess/selectionprocess?jobId=${jobId}`);
      console.log("Job saved with Id:", jobId);
      alert("Job saved successfully.");
    } catch (error) {
      console.error(error);
      alert("Error saving job.");
    }
  };

  const [newSocialLink, setNewSocialLink] = useState({ platform: 'linkedin', url: '' });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSocialLink = () => {
    if (newSocialLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink, id: Date.now() }]
      }));
      setNewSocialLink({ platform: 'linkedin', url: '' });
    }
  };

  const removeSocialLink = (id: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8f6f2] text-neutral-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-[#d9eadf] blur-3xl" />
          <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-[#f0e3ce] blur-3xl" />
        </div>

        <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
          < Navbar />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-18 sm:px-6 lg:px-8">
            <div className="mb-10 rounded-[1.75rem] border border-[#e7dfd3] bg-white/90 p-7 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] backdrop-blur sm:p-9">
            <span className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#f8f1e3] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a6548]">
              Hiring Workflow
            </span>
            <h1 className="mt-4 text-4xl font-serif tracking-tight text-[#1d1b18] sm:text-5xl">
                Add Your <span className="text-[#8b6c3f]">Job Details</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                Create a comprehensive job posting with all the essential details
            </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-[#e8e0d4] bg-white shadow-[0_28px_60px_-44px_rgba(0,0,0,0.5)]">
            <div className="border-b border-[#eee6da] p-8 sm:p-10">
                <h2 className="mb-6 flex items-center text-2xl font-semibold text-[#1d1b18]">
                <Building2 className="mr-3 h-6 w-6 text-[#8b6c3f]" />
                Basic Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="e.g., TechCorp Inc."
                    className="w-full rounded-xl border border-[#d9d1c4] bg-[#fffdfa] px-4 py-3 transition-all duration-200 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full rounded-xl border border-[#d9d1c4] bg-[#fffdfa] px-4 py-3 transition-all duration-200 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA (Remote)"
                      className="w-full rounded-xl border border-[#d9d1c4] bg-[#fffdfa] py-3 pl-10 pr-4 transition-all duration-200 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Website
                    </label>
                    <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                        placeholder="https://company.com"
                      className="w-full rounded-xl border border-[#d9d1c4] bg-[#fffdfa] py-3 pl-10 pr-4 transition-all duration-200 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    />
                    </div>
                </div>
                </div>

                <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Social Media Links
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <select
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                    className="rounded-xl border border-[#d9d1c4] bg-[#fffdfa] px-4 py-3 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    </select>
                    <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Enter URL"
                    className="flex-1 rounded-xl border border-[#d9d1c4] bg-[#fffdfa] px-4 py-3 placeholder:text-neutral-400 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                    />
                    <button
                    onClick={addSocialLink}
                    className="flex items-center justify-center rounded-xl bg-[#1f2321] px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e]"
                    >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                    </button>
                </div>

                {formData.socialLinks.length > 0 && (
                  <div className="space-y-2">
                    {formData.socialLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between rounded-xl border border-[#ede4d7] bg-[#fbf8f2] px-4 py-3">
                        <div className="flex items-center">
                            {getSocialIcon(link.platform)}
                            <span className="ml-3 text-gray-700 capitalize">{link.platform}</span>
                      <span className="ml-3 text-sm text-[#2f5a8b]">{link.url}</span>
                        </div>
                        <button
                            onClick={() => removeSocialLink(link.id)}
                      className="text-red-500 transition-colors duration-200 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>

            <div className="p-8 sm:p-10">
              <h2 className="mb-6 flex items-center text-2xl font-semibold text-[#1d1b18]">
              <Edit className="mr-3 h-6 w-6 text-[#8b6c3f]" />
                About Job <span className="text-red-500 ml-1">*</span>
                </h2>

              <div className="overflow-hidden rounded-xl border border-[#ded5c9]">
              <div className="flex border-b border-[#e8dfd2] bg-[#f7f2e9]">
                    <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
                        activeTab === 'edit'
                  ? 'border-b-2 border-[#8b6c3f] bg-white text-[#2a241c]'
                  : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                    >
                    <Edit className="w-4 h-4 mr-2" />
                    Write
                    </button>
                    <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
                        activeTab === 'preview'
                      ? 'border-b-2 border-[#8b6c3f] bg-white text-[#2a241c]'
                      : 'text-neutral-600 hover:text-neutral-800'
                    }`}
                    >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                    </button>
                </div>

                <div className="min-h-96 bg-white">
                    {activeTab === 'edit' ? (
                    <div className="p-4">
                        <textarea
                        value={formData.aboutJob}
                        onChange={(e) => handleInputChange('aboutJob', e.target.value)}
                        placeholder="Write about the job requirements, qualifications, perks, eligibility, etc.
                                    Use markdown formatting:
                                    # Main Heading
                                    ## Sub Heading
                                    ### Section Heading

                                    - Bullet point 1
                                    - Bullet point 2

                                    1. Numbered list
                                    2. Another item

                                    **Bold text**

                                    Requirements:
                                    - 3+ years experience
                                    - Bachelor's degree

                                    Qualifications:
                                    - Strong problem-solving skills
                                    - Team player

                                    Perks:
                                    - Health insurance
                                    - Flexible hours
                                    - Remote work"
                        className="h-80 w-full resize-none rounded-lg border border-[#ede5d9] bg-[#fffdfa] px-4 py-3 leading-relaxed text-gray-700 focus:border-[#8b6c3f] focus:outline-none focus:ring-2 focus:ring-[#dcc5a0]"
                        />
                        <div className="mt-4 border-t border-gray-200 pt-4 text-xs text-gray-500">
                        <p className="mb-2"><strong>Formatting Tips:</strong></p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                            <p><code># Heading 1</code> → Large heading</p>
                            <p><code>## Heading 2</code> → Medium heading</p>
                            <p><code>### Heading 3</code> → Small heading</p>
                            </div>
                            <div>
                            <p><code>- Item</code> → Bullet point</p>
                            <p><code>1. Item</code> → Numbered list</p>
                            <p><code>**Bold**</code> → <strong>Bold text</strong></p>
                            </div>
                        </div>
                        </div>
                    </div>
                    ) : (
                    <div className="prose max-w-none p-6 prose-headings:text-[#2a241c] prose-a:text-[#2f5a8b]">
                        {renderMakrdown(formData.aboutJob)}
                    </div>
                    )}
                </div>
                </div>
            </div>

            <div className="flex flex-col justify-end gap-4 border-t border-[#eee5d9] bg-[#fcfaf7] px-8 py-6 sm:flex-row sm:px-10">
                <button
                  onClick={handleSubmit}
                  className="flex items-center justify-center rounded-xl bg-[#1f2321] px-8 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2b312e]">
                  <Save className="w-4 h-4 mr-2" />
                  Publish Job
                </button>
            </div>
            </div>
        </div>

        <FooterLogin />

    </div>
  );
}

