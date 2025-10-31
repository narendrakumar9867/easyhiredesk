import React, { useState } from 'react';
import { FAQItem } from '../components/FAQItem';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqItems = [
        {
            question: "Why do we see lightning before we hear thunder?",
            answer: "Because light travels faster than sound. Lightning light reaches our eyes almost instantly, while thunder sound takes longer to reach our ears."
        },
        {
            question: "What is the main purpose of photosynthesis?",
            answer: "The main purpose of photosynthesis is to convert sunlight into chemical energy, allowing plants to make food (glucose) and release oxygen."
        },
        {
            question: "Why do we see lightning before we hear thunder?",
            answer: "Because light travels faster than sound. Lightning light reaches our eyes almost instantly, while thunder sound takes longer to reach our ears."
        },
        {
            question: "What is the main purpose of photosynthesis?",
            answer: "The main purpose of photosynthesis is to convert sunlight into chemical energy, allowing plants to make food (glucose) and release oxygen."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className='bg-white px-4 md:py-24 sm:px-6 lg:px-8' aria-labelledby='faq-title'>
            <div className='max-w-3xl mx-auto'>
                <h2 id='faq-title' className='text-3xl font-semibold text-center text-black mb-12'>
                    Frequently Asked Questions
                </h2>

                <div className='divide-y divide-gray-2000' role='region' aria-label='FAQ accordion'>
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