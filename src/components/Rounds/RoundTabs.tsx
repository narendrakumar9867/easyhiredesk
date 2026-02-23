import React from 'react';

interface RoundTabsProps {
  totalRounds: number;
  currentRound: number;
  allRoundsData: Record<number, any>;
  onRoundChange: (round: number) => void;
}

const RoundTabs: React.FC<RoundTabsProps> = ({
  totalRounds,
  currentRound,
  allRoundsData,
  onRoundChange
}) => {
  const generateRounds = () => {
    return Array.from({ length: totalRounds }, (_, i) => i + 1);
  };

  return (
    <div className="flex justify-center gap-8 border-gray-300 pb-2">
      {generateRounds().map((round) => (
        <div 
          key={round}
          onClick={() => onRoundChange(round)}
          className={`pb-2 cursor-pointer transition-all ${
            currentRound === round 
              ? "border-b-4 border-black font-bold text-black" 
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Round {round}
          {allRoundsData[round] && <span className="ml-1 text-green-500">✓</span>}
        </div>
      ))}
    </div>
  );
};

export default RoundTabs;