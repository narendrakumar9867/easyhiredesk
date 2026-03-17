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
    <div className="mb-8 overflow-x-auto">
      <div className="flex min-w-max flex-wrap gap-3 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === tab
                ? 'border border-black bg-black text-white shadow-sm'
                : 'border border-transparent bg-white text-gray-700 hover:border-neutral-300 hover:text-black'
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
        ))}
      </div>
    </div>
  );
};

export default RoundTabs;