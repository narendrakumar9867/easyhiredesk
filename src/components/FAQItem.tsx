import React from "react";
import { Minus, Plus } from "lucide-react";

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
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-neutral-300">
            <h3>
                <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={toggleOpen}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    id={headingId}
                >
                    <span className="text-base font-semibold text-neutral-900 sm:text-lg">{question}</span>
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700">
                        {isOpen ? (
                            <Minus className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Plus className="h-4 w-4" aria-hidden="true" />
                        )}
                    </span>
                </button>
            </h3>

            <div
                id={contentId}
                role="region"
                aria-labelledby={headingId}
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-7 text-neutral-600 sm:text-base">{answer}</p>
                </div>
            </div>
        </article>
    );
};

export default FAQItem;
