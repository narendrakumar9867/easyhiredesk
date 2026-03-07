"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/src/hooks/useAuth";
import { axiosInstance } from "@/src/utils/axios";
import Navbar from '@/src/components/Navbar';
import FooterLogin from '@/src/components/FooterLogin';
import { Application, Job } from '@/src/types/Job';
import { Check, X, Clock, Download, Search, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function CandidatePage() {
  const { authUser, token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'selected' | 'rejected' | 'in-progress'>('all');

  // Fetch candidate's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axiosInstance.get("/jobs/my-applications", config);
        const apps = response.data.applications || [];
        setApplications(apps);
        setFilteredApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  // Handle search and filter
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.jobId?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobId?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobId?.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  // Get status badge styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredApplications.map(app => ({
      'Job Title': app.jobId?.jobTitle || 'N/A',
      'Company': app.jobId?.companyName || 'N/A',
      'Location': app.jobId?.location || 'N/A',
      'Status': app.status,
      'Applied Date': new Date(app.submittedAt).toLocaleDateString(),
      'Applied Time': new Date(app.submittedAt).toLocaleTimeString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications');
    XLSX.writeFile(workbook, `my-applications-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Get status counts
  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    selected: applications.filter(a => a.status === 'selected').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    'in-progress': applications.filter(a => a.status === 'in-progress').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading your applications...</div>
        </div>
        <FooterLogin />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Total Applications</div>
            <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="text-gray-600 text-sm font-medium mb-2">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-gray-600 text-sm font-medium mb-2">Selected</div>
            <div className="text-3xl font-bold text-green-600">{statusCounts.selected}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-gray-600 text-sm font-medium mb-2">Rejected</div>
            <div className="text-3xl font-bold text-red-600">{statusCounts.rejected}</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">
                {applications.length === 0
                  ? "You haven't applied to any jobs yet."
                  : "No applications match your filters."}
              </p>
              {applications.length === 0 && (
                <a href="/joblists" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Browse Jobs
                </a>
              )}
            </div>
          ) : (
            filteredApplications.map((application, index) => (
              <div
                key={application._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.jobId?.jobTitle || 'Job Title N/A'}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Company:</span> {application.jobId?.companyName || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Location:</span> {application.jobId?.location || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Applied:</span>{' '}
                            {new Date(application.submittedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}{' '}
                            at{' '}
                            {new Date(application.submittedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col md:items-end gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getStatusStyles(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>

                    {/* Round Statuses */}
                    {application.roundStatuses && application.roundStatuses.length > 0 && (
                      <div className="text-sm">
                        <p className="text-gray-600 font-medium mb-2">Rounds:</p>
                        <div className="flex flex-wrap gap-2">
                          {application.roundStatuses.map((round) => (
                            <span
                              key={round.round}
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyles(round.status)}`}
                            >
                              R{round.round}: {round.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div className="md:pl-4">
                    <a
                      href={`/joblists/jobdetails-candidate/${application.jobId?._id}`}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FooterLogin />
    </div>
  );
}
