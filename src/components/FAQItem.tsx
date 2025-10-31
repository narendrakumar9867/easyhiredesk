import React from 'react';
import { FileMinus, FilePlus } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen?: boolean;
    toggleOpen: () => void;
    id: string;
}


export const FAQItem = ({ question, answer, isOpen = false, toggleOpen, id }: FAQItemProps) => {
    const headingId = `question-${id}`;
    const contentId = `answer-${id}`;
    return (
        <div className="border-b border-gray-200 py-5">
            <h3>
                <button 
                className="flex justify-between items-center w-full text-left rounded-md"
                onClick={toggleOpen}
                aria-expanded={isOpen}
                aria-controls={contentId}
                id={headingId}
                >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                <span className="ml-6 flex-shrink-0">
                    {isOpen ? (
                    <FileMinus className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    ) : (
                    <FilePlus className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    )}
                </span>
                </button>
            </h3>
        
            <div 
                id={contentId}
                role="region"
                aria-labelledby={headingId}
                className={`mt-2 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-base text-gray-700">
                {answer}
                </p>
            </div>
        </div>
    )
};

export default FAQItem;
