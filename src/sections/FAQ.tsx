import React, { useState } from "react";
import { FAQItem } from "../components/FAQItem";

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqItems = [
        {
            question: "How do I apply for a job on EasyhireDesk?",
            answer:
                "Go to the job list, open a role that matches your profile, and submit your application details through the candidate flow.",
        },
        {
            question: "Can I track my application status after applying?",
            answer:
                "Yes. You can track progress updates such as pending, in-progress, selected, or rejected as your application moves through rounds.",
        },
        {
            question: "How are candidates informed about selection decisions?",
            answer:
                "Hiring managers can configure communication during round setup, and candidates receive updates based on the decisions made in each stage.",
        },
        {
            question: "Who should I contact if I face a platform issue?",
            answer:
                "Use the contact form on this page or email easyhiredesk@gmail.com with your issue details, and our team will help you as soon as possible.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-white px-4 py-8 sm:px-6 lg:px-8" aria-labelledby="faq-title">
            <div className="mx-auto max-w-6xl rounded-[2rem] border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-6 sm:p-8 lg:p-10">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Support FAQ
                    </p>
                    <h2 id="faq-title" className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-neutral-600 sm:text-base">
                        Quick answers to common questions about applying, tracking status, and getting support on EasyhireDesk.
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-3xl space-y-3" role="region" aria-label="FAQ accordion">
                    {faqItems.map((item, index) => (
                        <FAQItem
                            key={index}
                            id={`faq-${index}`}
                            question={item.question}
                            answer={item.answer}
                            isOpen={openIndex === index}
                            toggleOpen={() => toggleFAQ(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
