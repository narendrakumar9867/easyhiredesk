"use client";

import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FormResponse } from '@/src/types/form';
import { Job } from '@/src/types/Job';

interface UseCandidatesProps {
  token: string | null;
  authUserEmail: string | undefined;
  candidateResponses: FormResponse[];
  setCandidateResponses: React.Dispatch<React.SetStateAction<FormResponse[]>>;
}

interface UseCandidatesReturn {
  updating: string | null;
  openCandidateId: string | null;
  setOpenCandidateId: (id: string | null) => void;
  updateCandidateStatus: (responseId: string, status: 'selected' | 'rejected', round: number, notes?: string) => Promise<void>;
  viewUploadedFile: (responseId: string, fieldLabel: string) => Promise<void>;
  exportToExcel: (roundNumber: number, job: Job | null, roundTitles: { [key: number]: string }, candidateFilter: string) => void;
  getRoundStatus: (candidate: FormResponse, round: number) => string;
  getCandidatesForRound: (round: number, candidateFilter: string) => FormResponse[];
  getStatusCounts: (round: number, candidates: FormResponse[]) => { selected: number; rejected: number; pending: number };
}

export const useCandidates = ({
  token,
  authUserEmail,
  candidateResponses,
  setCandidateResponses
}: UseCandidatesProps): UseCandidatesReturn => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [openCandidateId, setOpenCandidateId] = useState<string | null>(null);

  // Get round status helper
  const getRoundStatus = (candidate: FormResponse, round: number): string => {
    if (round === 1) return candidate.status;
    const roundStatus = candidate.roundStatuses?.find(rs => rs.round === round);
    return roundStatus?.status || 'pending';
  };

  // Get candidates for specific round
  const getCandidatesForRound = (round: number, candidateFilter: string) => {
    let candidates = [];
    if (round === 1) {
      candidates = candidateResponses;
    } else {
      candidates = candidateResponses.filter(candidate => {
        const prevRoundStatus = getRoundStatus(candidate, round - 1);
        return prevRoundStatus === 'selected';
      });
    }

    if (candidateFilter === "all") {
      return candidates;
    } else {
      return candidates.filter(candidate => {
        const status = getRoundStatus(candidate, round);
        return status === candidateFilter;
      });
    }
  };

  // Get status counts
  const getStatusCounts = (round: number, candidates: FormResponse[]) => {
    const selected = candidates.filter(c => getRoundStatus(c, round) === 'selected').length;
    const rejected = candidates.filter(c => getRoundStatus(c, round) === 'rejected').length;
    const pending = candidates.filter(c => getRoundStatus(c, round) === 'pending').length;

    return { selected, rejected, pending };
  };

  // Update candidate status
  const updateCandidateStatus = async (
    responseId: string,
    status: 'selected' | 'rejected',
    round: number = 1,
    notes?: string
  ) => {
    try {
      setUpdating(responseId);

      const hireManagerEmail = authUserEmail || "";
      if (!hireManagerEmail) {
        alert('Unable to send email: User email not found. Please log in again.');
        console.error('No hire manager email found in authUser');
      }

      console.log(`Updating candidate ${responseId} status to ${status} for round ${round}`);
      console.log('Hire manager email being sent:', hireManagerEmail);

      const response = await axios.put(
        `http://localhost:5000/api/form/update-status/${responseId}`,
        { status, notes: notes || '', round, hireManagerEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Status update response:", response.data);

      // Update local state with round specific status
      setCandidateResponses(prev =>
        prev.map(candidate => {
          if (candidate._id === responseId) {
            const updatedCandidate = { ...candidate };

            if (!updatedCandidate.roundStatuses || !Array.isArray(updatedCandidate.roundStatuses)) {
              updatedCandidate.roundStatuses = [];
            }

            const existingRoundIndex = updatedCandidate.roundStatuses.findIndex(rs => rs.round === round);

            if (existingRoundIndex >= 0) {
              updatedCandidate.roundStatuses[existingRoundIndex] = {
                round,
                status,
                notes: notes || updatedCandidate.roundStatuses[existingRoundIndex].notes || " "
              };
            } else {
              updatedCandidate.roundStatuses.push({
                round,
                status,
                notes: notes || " "
              });
            }

            if (round === 1) {
              updatedCandidate.status = status;
              if (notes) updatedCandidate.notes = notes;
            }

            return updatedCandidate;
          }
          return candidate;
        })
      );

      // Show success message with email status
      const candidateName = candidateResponses.find(c => c._id === responseId)?.candidateName || 'Candidate';

      if (response.data.emailSent) {
        alert(`${candidateName} has been ${status}. Email sent successfully.`);
      } else {
        alert(`${candidateName} has been ${status}. Status updated but email failed to send: ${response.data.emailError || 'Unknown error'}`);
      }

    } catch (error: any) {
      console.error("Error updating candidate status:", error);
      alert(`Failed to update candidate status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  // View uploaded file
  const viewUploadedFile = async (responseId: string, fieldLabel: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/form/file/${responseId}/${fieldLabel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        window.open(response.data.data.fileUrl);
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Failed to load file");
    }
  };

  // Export to Excel
  const exportToExcel = (
    roundNumber: number,
    job: Job | null,
    roundTitles: { [key: number]: string },
    candidateFilter: string
  ) => {
    let candidatesToExport = [];
    if (roundNumber === 1) {
      candidatesToExport = candidateResponses;
    } else {
      candidatesToExport = candidateResponses.filter(candidate => {
        const prevRoundStatus = getRoundStatus(candidate, roundNumber - 1);
        return prevRoundStatus === 'selected';
      });
    }

    // Apply current filter
    const filteredCandidates = candidatesToExport.filter(candidate => {
      if (candidateFilter === "all") return true;
      return getRoundStatus(candidate, roundNumber) === candidateFilter;
    });

    if (filteredCandidates.length === 0) {
      alert('No candidates to export for this round!');
      return;
    }

    // Get all unique field labels dynamically from responses
    const allFieldLabels = new Set<string>();
    filteredCandidates.forEach(candidate => {
      candidate.responses.forEach(response => {
        if (response.fieldType !== 'file') {
          allFieldLabels.add(response.fieldLabel);
        }
      });
    });

    // Prepare data for Excel with dynamic columns
    const excelData = filteredCandidates.map(candidate => {
      const status = getRoundStatus(candidate, roundNumber);
      const rowData: { [key: string]: any } = {};

      // Add all form field responses dynamically
      allFieldLabels.forEach(label => {
        const response = candidate.responses.find(r => r.fieldLabel === label);
        if (response) {
          let value = response.value;

          // Handle different field types
          if (Array.isArray(value)) {
            value = value.length > 0 ? value.join(', ') : 'None selected';
          } else if (response.fieldType === 'file') {
            value = value?.fileName || 'No file uploaded';
          } else if (response.fieldType === 'date' && value) {
            value = new Date(value).toLocaleDateString('en-IN');
          } else if (!value || value === '') {
            value = 'N/A';
          }

          rowData[label] = value;
        } else {
          rowData[label] = 'N/A';
        }
      });

      // Add metadata columns at the end
      rowData['Applied Date'] = new Date(candidate.submittedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      rowData['Status'] = status.charAt(0).toUpperCase() + status.slice(1);
      rowData['Notes'] = candidate.notes || 'No notes';

      return rowData;
    });

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths dynamically
    const columnWidths = [{ wch: 25 }];

    // Add widths for dynamic fields
    allFieldLabels.forEach(label => {
      const labelLength = label.length;
      columnWidths.push({ wch: Math.max(labelLength + 5, 20) });
    });

    // Add widths for metadata columns
    columnWidths.push(
      { wch: 20 }, // Applied Date
      { wch: 12 }, // Status
      { wch: 40 }  // Notes
    );

    ws['!cols'] = columnWidths;

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    const sheetName = `Round ${roundNumber} - ${roundTitles[roundNumber] || 'Candidates'}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));

    // Generate file name
    const fileName = `${job?.jobTitle}_Round_${roundNumber}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download Excel file
    XLSX.writeFile(wb, fileName);
  };

  return {
    updating,
    openCandidateId,
    setOpenCandidateId,
    updateCandidateStatus,
    viewUploadedFile,
    exportToExcel,
    getRoundStatus,
    getCandidatesForRound,
    getStatusCounts
  };
};