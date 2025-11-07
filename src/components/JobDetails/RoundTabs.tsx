"use client";

import React from 'react';

interface RoundTabsProps {
  tabs: string[];
  activeTab: string;
  roundTitles: { [key: number]: string };
  onTabChange: (tab: string) => void;
}

const RoundTabs: React.FC<RoundTabsProps> = ({ 
  tabs, 
  activeTab, 
  roundTitles, 
  onTabChange 
}) => {
  return (
    <div className="flex items-center justify-between mb-8 overflow-x-hidden">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab}>
          <button
            onClick={() => onTabChange(tab)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-black text-white shadow-2xl border-2 border-black'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-black hover:shadow-lg'
            }`}
          >
            {tab.startsWith('Round ') ? (
              <>
                {tab}
                {roundTitles[parseInt(tab.split(' ')[1])] && (
                  <> - {roundTitles[parseInt(tab.split(' ')[1])]}</>
                )}
              </>
            ) : (
              tab
            )}
          </button>
          {index < tabs.length - 1 && (
            <div className="flex-1 h-px bg-black mx-4 min-w-[20px]"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RoundTabs;