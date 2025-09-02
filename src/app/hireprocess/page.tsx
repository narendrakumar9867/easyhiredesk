"use client";
import React, { useState } from 'react';
import { Eye, Edit, Building2, MapPin, Globe, Github, Linkedin, Twitter, Plus, X, Save } from 'lucide-react';
import axios from "axios";

import Navbar from "@/src/components/Navbar";
import FooterLogin from '@/src/components/FooterLogin';
import { useRouter } from 'next/navigation';


export default function JobDetailsPage() {
  const [activeTab, setActiveTab] = useState('edit');
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    companyWebsite: '',
    socialLinks: [],
    aboutJob: ''
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/jobs", formData, {
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

  const handleInputChange = (field, value) => {
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

  const removeSocialLink = (id) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return <p className="text-gray-500 italic">No content added yet...</p>;

    return text.split('\n').map((line, index) => {
     
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-6">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-medium text-gray-700 mb-2 mt-4">{line.substring(4)}</h3>;
      }
      
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} className="text-gray-700 mb-1 ml-4">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            {line.substring(2)}
          </li>
        );
      }
      
      var isNumberedList = function(str) {
        let i = 0;

        while (i < str.length && str[i] >= "0" && str[i] <= "9") {
            i++;
        }

        return i > 0 && i < str.length - 1 && str[i] === "." && str[i + 1] === " ";
      };

      function extractNumberListContent(str) {
        let i = 0;

        while (i < str.length && str[i] >= "0" && str[i] <= "9") {
            i++;
        }

        i += 2;

        return str.substring(i);
      }

      if (isNumberedList(line)) {
        return <li key={index} className="text-gray-700 mb-1 ml-4 list-decimal">
            {extractNumberListContent(line)}
        </li>
      }
      
      function parserBoldText(text) {
        const result = [];

        let i = 0;
        let currentText = "";

        while(i < text.length) {

            if(i < text.length - 1 && text[i] === "*" && text[i + 1] === "*") {

                if(currentText) {
                    result.push(currentText);
                    currentText = "";
                }

                let j = i + 2;
                let boldContent = "";

                while(j < text.length - 1) {
                    if(text[j] === "*" && text[j + 1] === "*") {
                        result.push(`<strong>${boldContent}</strong>`);
                        i = j + 2;
                        break;
                    }
                    boldContent += text[j];
                    j++;
                }

                if(j >= text.length - 1) {
                    currentText += "**";
                    i++;
                }
            }
            else {
                currentText += text[i];
                i++;
            }
        }

        if(currentText) {
            result.push(currentText);
        }

        return result.join("");
      }

      const boldText = parserBoldText(line);

      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      return <p key={index} className="text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: boldText }}></p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Add Your <span className="bg-gradient-to-r text-gray-400 bg-clip-text ">Job Details</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create a comprehensive job posting with all the essential details
            </p>
            </div>

            <div className="bg-white overflow-hidden">
            <div className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3 text-gray-400" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    </select>
                    <input
                    type="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Enter URL"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                    onClick={addSocialLink}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-200 hover:text-black transition-colors duration-200 flex items-center"
                    >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                    </button>
                </div>

                {formData.socialLinks.length > 0 && (
                    <div className="space-y-2">
                    {formData.socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                        <div className="flex items-center">
                            {getSocialIcon(link.platform)}
                            <span className="ml-3 text-gray-700 capitalize">{link.platform}</span>
                            <span className="ml-3 text-blue-600 text-sm">{link.url}</span>
                        </div>
                        <button
                            onClick={() => removeSocialLink(link.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>

            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Edit className="w-6 h-6 mr-3 text-gray-400" />
                About Job <span className="text-red-500 ml-1">*</span>
                </h2>

                <div className="border border-gray-300 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-300 bg-gray-50">
                    <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
                        activeTab === 'edit'
                        ? 'bg-white border-b-2 border-black text-black'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    >
                    <Edit className="w-4 h-4 mr-2" />
                    Write
                    </button>
                    <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center ${
                        activeTab === 'preview'
                        ? 'bg-white border-b-2 border-black text-black'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                    </button>
                </div>

                <div className="min-h-96">
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
                        className="w-full h-80 px-4 py-3 border-none resize-none focus:outline-none text-gray-700 leading-relaxed"
                        />
                        <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-4">
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
                    <div className="p-6 prose prose-blue max-w-none">
                        {renderMarkdown(formData.aboutJob)}
                    </div>
                    )}
                </div>
                </div>
            </div>

            <div className="px-8 py-6 bg-white border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
                {/* <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                Save as Draft
                </button> */}
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-200 hover:text-black transition-colors duration-200 flex items-center justify-center">
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

