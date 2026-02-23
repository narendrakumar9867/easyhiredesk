import { useState, useCallback } from 'react';
import { RoundData, FormField } from '@/src/types/rounds';

interface UseRoundDataProps {
  currentRound: number;
  formFields: FormField[];
  selectedEmail: string;
  rejectionEmail: string;
  roundTitles: Record<number, string>;
}

export const useRoundData = () => {
  const [allRoundsData, setAllRoundsData] = useState<Record<number, RoundData>>({});
  const [roundTitles, setRoundTitles] = useState<Record<number, string>>({
    1: 'Candidate Details Form'
  });

  const saveCurrentRoundData = useCallback(({
    currentRound,
    formFields,
    selectedEmail,
    rejectionEmail,
    roundTitles
  }: UseRoundDataProps) => {
    const currentRoundData: RoundData = {
      title: roundTitles[currentRound] || `Round ${currentRound}`,
      formFields: currentRound === 1 ? formFields : [],
      selectedEmail,
      rejectionEmail
    };
    
    setAllRoundsData(prev => ({
      ...prev,
      [currentRound]: currentRoundData
    }));
  }, []);

  const updateRoundTitle = (roundNumber: number, title: string) => {
    setRoundTitles(prev => ({
      ...prev,
      [roundNumber]: title
    }));
  };

  return {
    allRoundsData,
    setAllRoundsData,
    roundTitles,
    setRoundTitles,
    saveCurrentRoundData,
    updateRoundTitle
  };
};