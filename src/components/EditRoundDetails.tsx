import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EditRoundDetailsProps {
  jobId: string;
  roundNumber: number;
  token: string;
  onClose: () => void;
  onSave: () => void;
}

const EditRoundDetails: React.FC<EditRoundDetailsProps> = ({ 
  jobId, 
  roundNumber, 
  token, 
  onClose, 
  onSave 
}) => {
  const [roundTitle, setRoundTitle] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [rejectionEmail, setRejectionEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch existing round details
  useEffect(() => {
    const fetchRoundDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rounds/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const roundDetail = response.data.data.roundDetails.find(
          (rd: any) => rd.roundNumber === roundNumber
        );
        
        if (roundDetail) {
          setRoundTitle(roundDetail.title || '');
          setSelectedEmail(
            `Subject: ${roundDetail.selectedEmail.subject}\n\n${roundDetail.selectedEmail.body}`
          );
          setRejectionEmail(
            `Subject: ${roundDetail.nonSelectedEmail.subject}\n\n${roundDetail.nonSelectedEmail.body}`
          );
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching round details:', error);
        setLoading(false);
      }
    };

    fetchRoundDetails();
  }, [jobId, roundNumber, token]);

  const handleSave = async () => {
    // Parse email function (same as in RoundPage)
    const parseEmail = (emailText: string) => {
      const lines = emailText.split('\n');
      const subject = lines[0].replace('Subject: ', '').trim();
      const body = lines.slice(2).join('\n').trim();
      return { subject, body };
    };

    try {
      const payload = {
        jobId,
        roundNumber,
        title: roundTitle,
        selectedEmail: parseEmail(selectedEmail),
        nonSelectedEmail: parseEmail(rejectionEmail)
      };

      await axios.put(
        `http://localhost:5000/api/round/details/${jobId}/${roundNumber}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Round details updated successfully!');
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error updating round details:', error);
      alert(`Failed to update: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Round {roundNumber} Details</h2>
          
          {/* Rest of your form UI here - similar to RoundPage */}
          
        </div>
      </div>
    </div>
  );
};

export default EditRoundDetails;